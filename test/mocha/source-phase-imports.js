import assert from "assert";
import * as AST from "../../lib/ast.js";
import { parse } from "../../lib/parse.js";
import { minify } from "../../main.js";

// Source-phase imports proposal: https://github.com/tc39/proposal-source-phase-imports
// Acorn (with the acorn-import-phases plugin) emits an `ImportDeclaration` whose
// `phase` field is either "source" or "defer". Terser must preserve this through
// from_mozilla_ast / to_mozilla_ast and the printer.

function build_moz_source_import(local_name, source, phase) {
    return {
        type: "Program",
        sourceType: "module",
        body: [{
            type: "ImportDeclaration",
            phase: phase,
            specifiers: [{
                type: "ImportDefaultSpecifier",
                local: { type: "Identifier", name: local_name }
            }],
            source: { type: "Literal", value: source, raw: JSON.stringify(source) },
            attributes: []
        }]
    };
}

describe("Source-phase imports", function() {
    it("preserves `import source` through from_mozilla_ast -> print", function() {
        const moz = build_moz_source_import("wasmModule", "./foo.wasm", "source");
        const terser_ast = AST.AST_Node.from_mozilla_ast(moz);
        const code = terser_ast.print_to_string();
        assert.strictEqual(code, 'import source wasmModule from"./foo.wasm";');
    });

    it("preserves `import defer` through from_mozilla_ast -> print", function() {
        const moz = build_moz_source_import("ns", "./mod.js", "defer");
        const terser_ast = AST.AST_Node.from_mozilla_ast(moz);
        const code = terser_ast.print_to_string();
        assert.strictEqual(code, 'import defer ns from"./mod.js";');
    });

    it("does not alter phase-less imports", function() {
        const moz = build_moz_source_import("x", "./y.js", undefined);
        const terser_ast = AST.AST_Node.from_mozilla_ast(moz);
        const code = terser_ast.print_to_string();
        assert.strictEqual(code, 'import x from"./y.js";');
    });

    it("round-trips through to_mozilla_ast", function() {
        const moz = build_moz_source_import("wasmModule", "./foo.wasm", "source");
        const terser_ast = AST.AST_Node.from_mozilla_ast(moz);
        const moz_out = terser_ast.to_mozilla_ast();
        const decl = moz_out.body[0];
        assert.strictEqual(decl.type, "ImportDeclaration");
        assert.strictEqual(decl.phase, "source");
    });

    it("does not add a phase field for normal imports going to_mozilla_ast", function() {
        const moz = build_moz_source_import("x", "./y.js", undefined);
        const terser_ast = AST.AST_Node.from_mozilla_ast(moz);
        const moz_out = terser_ast.to_mozilla_ast();
        assert.strictEqual(moz_out.body[0].phase, undefined);
    });

    it("survives minify when fed a spidermonkey AST", async function() {
        const moz = build_moz_source_import("wasmModule", "./foo.wasm", "source");
        const result = await minify(moz, { parse: { spidermonkey: true }, compress: false, mangle: false });
        assert.strictEqual(result.code, 'import source wasmModule from"./foo.wasm";');
    });

    describe("dynamic", function() {
        function build_moz_import_expression(specifier, phase) {
            return {
                type: "Program",
                sourceType: "module",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "ImportExpression",
                        source: { type: "Literal", value: specifier, raw: JSON.stringify(specifier) },
                        options: null,
                        ...(phase ? { phase } : {})
                    }
                }]
            };
        }

        it("from_mozilla_ast preserves `import.source(x)`", function() {
            const moz = build_moz_import_expression("./foo.wasm", "source");
            const code = AST.AST_Node.from_mozilla_ast(moz).print_to_string();
            assert.strictEqual(code, 'import.source("./foo.wasm");');
        });

        it("from_mozilla_ast preserves `import.defer(x)`", function() {
            const moz = build_moz_import_expression("./mod.js", "defer");
            const code = AST.AST_Node.from_mozilla_ast(moz).print_to_string();
            assert.strictEqual(code, 'import.defer("./mod.js");');
        });

        it("from_mozilla_ast leaves plain dynamic import alone", function() {
            const moz = build_moz_import_expression("./mod.js", undefined);
            const code = AST.AST_Node.from_mozilla_ast(moz).print_to_string();
            assert.strictEqual(code, 'import("./mod.js");');
        });

        it("to_mozilla_ast emits phase on ImportExpression", function() {
            const moz = build_moz_import_expression("./foo.wasm", "source");
            const ast = AST.AST_Node.from_mozilla_ast(moz);
            const out = ast.to_mozilla_ast();
            const expr = out.body[0].expression;
            assert.strictEqual(expr.type, "ImportExpression");
            assert.strictEqual(expr.phase, "source");
        });

        it("to_mozilla_ast omits phase for plain dynamic import", function() {
            const moz = build_moz_import_expression("./mod.js", undefined);
            const ast = AST.AST_Node.from_mozilla_ast(moz);
            const out = ast.to_mozilla_ast();
            assert.strictEqual(out.body[0].expression.phase, undefined);
        });

        it("native parser handles `import.source(x)`", async function() {
            const r = await minify('import.source("./foo.wasm");', { compress: false, mangle: false });
            assert.strictEqual(r.code, 'import.source("./foo.wasm");');
        });

        it("native parser handles `import.defer(x)`", async function() {
            const r = await minify('import.defer("./mod.js");', { compress: false, mangle: false });
            assert.strictEqual(r.code, 'import.defer("./mod.js");');
        });

        it("rejects bare `import.source` (must be a call)", function() {
            assert.throws(() => parse('let x = import.source;'), /can only be used in a dynamic import/);
        });

        it("rejects bare `import.defer` (must be a call)", function() {
            assert.throws(() => parse('let x = import.defer;'), /can only be used in a dynamic import/);
        });

        it("preserves the second argument", async function() {
            // The dynamic-import second arg (the so-called options/attributes
            // bag) is syntactically permitted on phased dynamic imports too.
            const r = await minify('import.source("./foo.wasm", opts);', { compress: false, mangle: false });
            assert.strictEqual(r.code, 'import.source("./foo.wasm",opts);');
        });

        it("survives compression with side-effect-free phased call dropped", async function() {
            // The phased dynamic-import callee itself has no side effects;
            // the call result going unused doesn't suppress evaluation
            // because the call expression does have side effects (the
            // module fetch).
            const r = await minify('import.source("./foo.wasm");', { compress: true, mangle: false });
            assert.ok(r.code.includes('import.source'), `expected phased call retained, got: ${r.code}`);
        });
    });

    describe("native parser", function() {
        function parse_first(code) {
            return parse(code).body[0];
        }

        it("parses `import source NAME from \"...\"`", function() {
            const node = parse_first('import source wasmModule from "./foo.wasm";');
            assert.ok(node instanceof AST.AST_Import);
            assert.strictEqual(node.phase, "source");
            assert.strictEqual(node.imported_name.name, "wasmModule");
            assert.strictEqual(node.module_name.value, "./foo.wasm");
        });

        it("parses `import defer * as NS from \"...\"`", function() {
            const node = parse_first('import defer * as ns from "./mod.js";');
            assert.ok(node instanceof AST.AST_Import);
            assert.strictEqual(node.phase, "defer");
            assert.ok(node.imported_names);
            assert.strictEqual(node.imported_names[0].name.name, "ns");
        });

        it("treats `import source from \"...\"` as a default import (back-compat)", function() {
            // Here `source` is the binding, not a phase keyword, because the
            // next token is `from`.
            const node = parse_first('import source from "./foo.js";');
            assert.ok(node instanceof AST.AST_Import);
            assert.strictEqual(node.phase, null);
            assert.strictEqual(node.imported_name.name, "source");
        });

        it("treats `import defer, {x} from \"...\"` as default + named (back-compat)", function() {
            const node = parse_first('import defer, { x } from "./foo.js";');
            assert.ok(node instanceof AST.AST_Import);
            assert.strictEqual(node.phase, null);
            assert.strictEqual(node.imported_name.name, "defer");
        });

        it("round-trips through parse -> print", async function() {
            const result = await minify('import source wasmModule from "./foo.wasm";', {
                compress: false, mangle: false
            });
            assert.strictEqual(result.code, 'import source wasmModule from"./foo.wasm";');
        });

        it("round-trips `import defer` through parse -> print", async function() {
            const result = await minify('import defer * as ns from "./mod.js";', {
                compress: false, mangle: false
            });
            assert.strictEqual(result.code, 'import defer*as ns from"./mod.js";');
        });
    });
});
