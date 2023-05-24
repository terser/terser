import assert from "assert";
import fs from "fs";
import * as acorn from "acorn";
import * as astring from "astring";
import * as AST from "../../lib/ast.js";
import { parse } from "../../lib/parse.js";
import { minify } from "../../main.js";

const acornParse = acorn.default ? acorn.default.parse : acorn.parse;
const astringGenerate = astring.default ? astring.default.generate : astring.generate;

describe("spidermonkey export/import sanity test", function() {
    it("Should judge between directives and strings correctly on import", async function() {
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

        var checkWalker = new AST.TreeWalker(node => {
            if (node instanceof AST.AST_String) {
                counter_strings++;
            } else if (node instanceof AST.AST_Directive) {
                counter_directives++;
            }
        });

        for (var i = 0; i < tests.length; i++) {
            counter_directives = 0;
            counter_strings = 0;

            var ast = parse(tests[i].input);
            var moz_ast = ast.to_mozilla_ast();
            var from_moz_ast = AST.AST_Node.from_mozilla_ast(moz_ast);

            from_moz_ast.walk(checkWalker);

            assert.strictEqual(counter_directives, tests[i].directives, "Directives count mismatch for test " + tests[i].input);
            assert.strictEqual(counter_strings, tests[i].strings, "String count mismatch for test " + tests[i].input);
        }
    });

    it("should output and parse ES6 code correctly", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = terser_ast.to_mozilla_ast();
        var from_moz_ast = AST.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
    });

    it("should be capable of importing from acorn", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = acornParse(code, { sourceType: "module", ecmaVersion: 2023 });
        var from_moz_ast = AST.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
    });

    it("should accept a spidermonkey AST w/ `parse.spidermonkey: true`", async function() {
        var moz_ast = acornParse("var a = 1 + 2", { sourceType: "module", ecmaVersion: 2023 });
        var result = await minify(moz_ast, {ecma: 2015, parse: {spidermonkey: true}});
        assert.deepStrictEqual(result.code, "var a=3;");
    });

    it("should produce a spidermonkey AST w/ `format.spidermonkey: true`", async function() {
        const code = "var a = 1 + 2";
        var result = await minify(code, {ecma: 2015, format: {spidermonkey: true}});
        assert.deepStrictEqual(astringGenerate(result.ast), "var a = 3;\n");
    });

    it("should correctly minify AST from from_moz_ast with default destructure", async () => {
        const code = "const { a = 1, b: [b = 2] = []} = {}";
        const acornAst = acornParse(code, { locations: true, ecmaVersion: 2015 });
        const terserAst = AST.AST_Node.from_mozilla_ast(acornAst);
        const result = await minify(terserAst, {ecma: 2015});
        assert.strictEqual(
            result.code,
            "const{a=1,b:[b=2]=[]}={};"
        );
    });

    it("should correctly minify AST from from_moz_ast with default function parameter", async () => {
        const code = "function run(x = 2){}";
        const acornAst = acornParse(code, { locations: true, ecmaVersion: 2023 });
        const terserAst = AST.AST_Node.from_mozilla_ast(acornAst);
        const result = await minify(terserAst);
        assert.strictEqual(
            result.code,
            "function run(x=2){}"
        );
    });

    it("should produce an AST compatible with astring", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = terser_ast.to_mozilla_ast();
        var generated = astringGenerate(moz_ast);
        var parsed = acornParse(generated, { sourceType: "module", ecmaVersion: 2023 });
        assert.strictEqual(
            AST.AST_Node.from_mozilla_ast(parsed).print_to_string(),
            terser_ast.print_to_string()
        );
    });
});
