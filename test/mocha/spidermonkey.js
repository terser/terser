import { inspect } from "util";
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

    it("should output and parse ESTree correctly", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = terser_ast.to_mozilla_ast();
        var from_moz_ast = AST.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
        assert(
            compare_asts(from_moz_ast, terser_ast),
            "after ESTree output>input, the output is the same but the AST is different"
        );
    });

    it("(temp): should output and parse ESTree correctly (astring incompatible bits)", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input-no-astring.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = terser_ast.to_mozilla_ast();
        var from_moz_ast = AST.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
        assert(
            compare_asts(from_moz_ast, terser_ast),
            "after ESTree output>input, the output is the same but the AST is different"
        );
    })

    it("should be capable of importing from acorn", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = acornParse(code, { sourceType: "module", ecmaVersion: 2026 });
        var from_moz_ast = AST.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
        assert(
            compare_asts(from_moz_ast, terser_ast),
            "parsing ESTree from Acorn and Terser, the output is the same but the AST is different"
        );
    });

    it("(temp): should be capable of importing from acorn (astring incompatible bits)", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input-no-astring.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = acornParse(code, { sourceType: "module", ecmaVersion: 2026 });
        var from_moz_ast = AST.AST_Node.from_mozilla_ast(moz_ast);
        assert.strictEqual(
            from_moz_ast.print_to_string(),
            terser_ast.print_to_string()
        );
        assert(
            compare_asts(from_moz_ast, terser_ast),
            "parsing ESTree from Acorn and Terser, the output is the same but the AST is different"
        );
    })

    it("should accept a spidermonkey AST w/ `parse.spidermonkey: true`", async function() {
        var moz_ast = acornParse("var a = 1 + 2", { sourceType: "module", ecmaVersion: 2026 });
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

    it("should correctly minify spidermonkey AST with condition and inlineable const variable declaration", async () => {
        const code = "if (a) { const tmp = a; tmp.b(); }";
        const ast = acornParse(code, { sourceType: 'module', locations: true, ecmaVersion: 2015 });
        const result = await minify(ast, { ecma: 2015, module: true, parse: { spidermonkey: true } });
        assert.strictEqual(
            result.code,
            "if(a){a.b()}"
        );
        const vanilla = await minify(code, { ecma: 2015, module: true });
        assert.strictEqual(
            result.code,
            vanilla.code
        );
    });

    it("should produce an AST compatible with astring", async function() {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = parse(code);
        var moz_ast = terser_ast.to_mozilla_ast();
        var generated = astringGenerate(moz_ast);
        var parsed = acornParse(generated, { sourceType: "module", ecmaVersion: 2026 });
        assert.strictEqual(
            AST.AST_Node.from_mozilla_ast(parsed).print_to_string(),
            terser_ast.print_to_string()
        );
        assert(
            compare_asts(AST.AST_Node.from_mozilla_ast(parsed), terser_ast),
            "after astring, the output is the same but the AST is different"
        );
    });

    it("should generate the same AST that acorn does", async function () {
        var code = fs.readFileSync("test/input/spidermonkey/input.js", "utf-8");
        var terser_ast = parse(code).to_mozilla_ast();
        var acorn_ast = acornParse(code, { sourceType: "module", ecmaVersion: 2026 });
        compare_estree_asts(terser_ast, acorn_ast)
    });
});

function compare_estree_asts(actual, expected) {
    const skip_keys = new Set(['loc', 'start', 'end', 'sourceType'])
    const skip_node_keys = {
        Program: new Set(['sourceType']),
        FunctionExpression: new Set(['expression']),
        FunctionDeclaration: new Set(['expression']),
        ArrowFunctionExpression: new Set(['expression', 'generator']),
    }

    function pojo_clone(node) {
        const out = { type: node.type }

        for (const [key, child] of Object.entries(node)) {
            // ESTree node
            if (child && typeof child.type === 'string') {
                out[key] = pojo_clone(child)
            } else if (Array.isArray(child)) {
                out[key] = child.map(
                    c => c && typeof c === 'object' ? pojo_clone(c) : c
                )
            } else {
                out[key] = child
            }
        }

        return out
    }

    actual = pojo_clone(actual)
    expected = pojo_clone(expected)

    try {
        deep_cmp(actual, expected);
    } catch (err) {
        if (err instanceof assert.AssertionError && err.node1) {
            if (err.node1.loc) {
                err.message += `\non line ${err.node1.loc.start.line}`;
            }
            if (err.key) {
                err.message += `\nKey "${err.key}" in ${err.node1.type} node`;
            } else {
                err.message += `\nIn ${err.node1.type} node`;
            }
        }
        if (err instanceof assert.AssertionError) {
            throw new Error(err.message);
        }
        throw err;
    }

    function deep_cmp(actual, expected) {
        const obj_keys = new Set([
            ...Object.keys(actual),
            ...Object.keys(expected),
        ]);
        for (const key of obj_keys) {
            if (skip_keys.has(key)) {
                continue;
            }
            if (skip_node_keys[actual.type] && skip_node_keys[actual.type].has(key)) {
                continue;
            }
            if (typeof expected[key] === "bigint") {
                continue; // Terser won't emit bigint values
            }
            if (key === "value" && actual.type == "Literal" && actual.regex) {
                continue; // "value" is emitted as a string from Acorn, but null from Terser.
            }

            const node1 = actual[key];
            const node2 = expected[key];

            // don't bother with optional keys
            {
                if (node1 == null && node2 == null) continue;

                let not_nil;
                if (node1 == null) not_nil = node2;
                if (node2 == null) not_nil = node1;

                if (not_nil && Array.isArray(not_nil)) continue;
            }

            if (
                node1
                && node2
                && typeof node1.type === 'string'
                && typeof node2.type === 'string'
            ) {
                try {
                    deep_cmp(node1, node2);
                } catch(err) {
                    if (!err.node1) {
                        err.node1 = node1;
                        err.node2 = node2;
                    }
                    throw err;
                }
            } else if (
                node1
                && node2
                && typeof node1 === 'object'
                && typeof node2 === 'object'
            ) {
                deep_cmp(node1, node2)
            } else {
                shallow_cmp(key, node1, node2);
            }
        }
    }

    function shallow_cmp(key, actual, expected) {
        try {
            assert.deepStrictEqual(actual, expected);
        } catch (e) {
            e.key = key;
            throw e;
        }
    }
}

function compare_asts(tree1, tree2) {
    const ignore_keys = new Set(['start', 'end']);

    if (!shallow_cmp(tree1, tree2)) return false;

    // Simultaneous preorder traversal
    const walk_1_state = [tree1];
    const walk_2_state = [tree2];

    const walk_1_push = walk_1_state.push.bind(walk_1_state);
    const walk_2_push = walk_2_state.push.bind(walk_2_state);

    let node1;
    let node2;

    try {
        while (walk_1_state.length && walk_2_state.length) {
            node1 = walk_1_state.pop();
            node2 = walk_2_state.pop();

            if (!shallow_cmp(node1, node2)) return false;

            node1._children_backwards(walk_1_push);
            node2._children_backwards(walk_2_push);

            if (walk_1_state.length !== walk_2_state.length) {
                // Different number of children
                return false;
            }
        }

        return walk_1_state.length == 0 && walk_2_state.length == 0;
    } catch (err) {
        if (err instanceof assert.AssertionError) {
            err.message += `\non line ${node2.start.line}`;
            if (err.key) err.message += `\nKey "${err.key}" in ${node2.TYPE} node `;
            else err.message += `\nIn ${node2.TYPE} node `;
            err.message += '"' + node2.print_to_string() + '"';
        }
        throw err;
    }

    function shallow_cmp(a, b) {
        for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
            if (key === "quote") {
                // skip difference between empty string and undefined
                if (a[key] == null && b[key] == "" || b[key] == null && a[key] == "") {
                    continue
                }
            }
            if (key === "is_generator" || key === "async") {
                // skip difference between false and undefined
                if (a[key] == null && b[key] == false || b[key] == null && a[key] == false) {
                    continue
                }
            }
            if (!ignore_keys.has(key)) {
                try {
                    shallow_cmp_key(key, a, b)
                } catch (e) {
                    if (e) e.key = key
                    throw e
                }
            }
        }
        return true;
    }

    function shallow_cmp_key(key, a, b) {
        const typeof_ = node =>
            node === null ? 'null' :
            node instanceof AST.AST_Node ? `AST_${node.TYPE}` :
            typeof node;

        if (!(key in a && key in b)) {
            err(
                key in a ? a[key] : '<key absent>',
                key in b ? b[key] : '<key absent>',
            );
        }
        if ((a[key] == null) !== (b[key] == null)) {
            err(a[key], b[key]);
        }
        if (typeof_(a[key]) !== typeof_(b[key]) && a[key] != null) {
            err(
                a[key],
                `<object of type ${typeof_(b[key])}>`,
            );
        }
        if (a[key] == b[key]) {
            return true; // sloppy equality is good for now
        }
        if (typeof a[key] === 'object' || typeof b[key] === 'object') {
            if (a[key].constructor !== b[key].constructor) {
                err(a[key], `<object>`);
            }
            if (a instanceof AST.AST_RegExp) {
                if (a.source !== b.source || a.flags !== b.flags) {
                    err(a[key], b[key]);
                }
                return true
            }
            if (Array.isArray(a[key])) {
                if (a instanceof AST.AST_Node) {
                    return true; // handled in recursion. This is something's body
                }
            }
            if (a[key] instanceof AST.AST_Node) {
                return true; // handled in recursion
            }
            throw new Error('Comparison not implemented')
        }

        err(a[key], b[key]);
    }

    function err(actual, expected) {
        assert.strictEqual(actual, expected);
        throw new Error("unreachable")
    }
}

