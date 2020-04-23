var assert = require("assert");
var fs = require("fs");
var acorn = require("acorn");
var astring = require("astring");
var Terser = require("../..");

describe("spidermonkey export/import sanity test", function() {
    it("Should judge between directives and strings correctly on import", function() {
        var tests = [
            {
                input: '"use strict";;"use sloppy"',
                directives: 1,
                strings: 1
            },
            {
                input: ';"use strict"',
                directives: 0,
                strings: 1
            },
            {
                input: '"use strict"; "use something else";',
                directives: 2,
                strings: 0
            },
            {
                input: 'function foo() {"use strict";;"use sloppy" }',
                directives: 1,
                strings: 1
            },
            {
                input: 'function foo() {;"use strict" }',
                directives: 0,
                strings: 1
            },
            {
                input: 'function foo() {"use strict"; "use something else"; }',
                directives: 2,
                strings: 0
            },
            {
                input: 'var foo = function() {"use strict";;"use sloppy" }',
                directives: 1,
                strings: 1
            },
            {
                input: 'var foo = function() {;"use strict" }',
                directives: 0,
                strings: 1
            },
            {
                input: 'var foo = function() {"use strict"; "use something else"; }',
                directives: 2,
                strings: 0
            },
            {
                input: '{"use strict";;"use sloppy" }',
                directives: 0,
                strings: 2
            },
            {
                input: '{;"use strict" }',
                directives: 0,
                strings: 1
            },
            {
                input: '{"use strict"; "use something else"; }',
                directives: 0,
                strings: 2
            }
        ];

        var counter_directives;
        var counter_strings;

        var checkWalker = new Terser.TreeWalker(node => {
            if (node instanceof Terser.AST_String) {
                counter_strings++;
            } else if (node instanceof Terser.AST_Directive) {
                counter_directives++;
            }
        });

        for (var i = 0; i < tests.length; i++) {
            counter_directives = 0;
            counter_strings = 0;

            var ast = Terser.parse(tests[i].input);
            var moz_ast = ast.to_mozilla_ast();
            var from_moz_ast = Terser.AST_Node.from_mozilla_ast(moz_ast);

            from_moz_ast.walk(checkWalker);

            assert.strictEqual(counter_directives, tests[i].directives, "Directives count mismatch for test " + tests[i].input);
            assert.strictEqual(counter_strings, tests[i].strings, "String count mismatch for test " + tests[i].input);
        }
    });

    it("should output and parse ES6 code correctly", function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = Terser.parse(code);
        var moz_ast = terser_ast.to_mozilla_ast();
        var from_moz_ast = Terser.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
    });

    it("should be capable of importing from acorn", function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = Terser.parse(code);
        var moz_ast = acorn.parse(code, {sourceType: 'module', ecmaVersion: 2018});
        var from_moz_ast = Terser.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
    });

    it("should correctly minify AST from from_moz_ast with default destructure", () => {
        const code = "const { a = 1, b: [b = 2] = []} = {}";
        const acornAst = acorn.parse(code, { locations: true });
        const terserAst = Terser.AST_Node.from_mozilla_ast(acornAst);
        const result = Terser.minify(terserAst, {ecma: 2015});
        assert.strictEqual(
            result.code,
            "const{a=1,b:[b=2]=[]}={};"
        );
    });

    it("should correctly minify AST from from_moz_ast with default function parameter", () => {
        const code = "function run(x = 2){}";
        const acornAst = acorn.parse(code, { locations: true });
        const terserAst = Terser.AST_Node.from_mozilla_ast(acornAst);
        const result = Terser.minify(terserAst);
        assert.strictEqual(
            result.code,
            "function run(x=2){}"
        );
    });

    it("should produce an AST compatible with astring", function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = Terser.parse(code);
        var moz_ast = terser_ast.to_mozilla_ast();
        var generated = astring.generate(moz_ast);
        var parsed = acorn.parse(generated, {
            sourceType: "module",
            ecmaVersion: 2018
        });
        assert.strictEqual(
            Terser.AST_Node.from_mozilla_ast(parsed).print_to_string(),
            terser_ast.print_to_string()
        );
    });

    function remove_loc(ast) {
        for (const key of Object.keys(ast)) {
            if (key === "loc") delete ast[key];
            if (key === "range") delete ast[key];
            if (typeof ast[key] === "object" && ast[key]) remove_loc(ast[key]);
        }
        return ast;
    }

    it("should produce correct ASTs which acorn can't read yet", function () {
        const code = `
            x ?? y
        `;

        assert.deepEqual(
            remove_loc(Terser.parse(code).to_mozilla_ast()).body[0].expression,
            {
                type: "LogicalExpression",
                operator: "??",
                left: { type: "Identifier", name: "x" },
                right: { type: "Identifier", name: "y" }
            }
        );
    });
});
