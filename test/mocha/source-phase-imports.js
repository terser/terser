import assert from "assert";
import * as AST from "../../lib/ast.js";
import { parse } from "../../lib/parse.js";
import { minify } from "../../main.js";

// Source-phase imports proposal: https://github.com/tc39/proposal-source-phase-imports
// Compress/print coverage lives in test/compress/harmony.js. These tests cover
// the bits that need a Mozilla/spidermonkey AST or specific parser errors.

function build_moz_static(local_name, source, phase) {
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

function build_moz_dynamic(specifier, phase) {
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

describe("Source-phase imports (mozilla AST)", function() {
    it("from_mozilla_ast: static `import source`", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_static("wasmModule", "./foo.wasm", "source"));
        assert.strictEqual(ast.print_to_string(), 'import source wasmModule from"./foo.wasm";');
    });

    it("from_mozilla_ast: static `import defer`", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_static("ns", "./mod.js", "defer"));
        assert.strictEqual(ast.print_to_string(), 'import defer ns from"./mod.js";');
    });

    it("from_mozilla_ast: phase-less static import unchanged", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_static("x", "./y.js", undefined));
        assert.strictEqual(ast.print_to_string(), 'import x from"./y.js";');
    });

    it("to_mozilla_ast: static phase round-trips", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_static("wasmModule", "./foo.wasm", "source"));
        const out = ast.to_mozilla_ast();
        assert.strictEqual(out.body[0].type, "ImportDeclaration");
        assert.strictEqual(out.body[0].phase, "source");
    });

    it("to_mozilla_ast: no `phase` field on plain static imports", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_static("x", "./y.js", undefined));
        assert.strictEqual(ast.to_mozilla_ast().body[0].phase, undefined);
    });

    it("from_mozilla_ast: dynamic `import.source(x)` produces AST_DynamicImport", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_dynamic("./foo.wasm", "source"));
        const expr = ast.body[0].body;
        assert.ok(expr instanceof AST.AST_DynamicImport);
        assert.strictEqual(expr.phase, "source");
        assert.strictEqual(ast.print_to_string(), 'import.source("./foo.wasm");');
    });

    it("from_mozilla_ast: dynamic `import.defer(x)`", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_dynamic("./mod.js", "defer"));
        assert.strictEqual(ast.print_to_string(), 'import.defer("./mod.js");');
    });

    it("from_mozilla_ast: plain dynamic import is still AST_Call", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_dynamic("./mod.js", undefined));
        const expr = ast.body[0].body;
        assert.ok(expr instanceof AST.AST_Call);
        assert.strictEqual(ast.print_to_string(), 'import("./mod.js");');
    });

    it("to_mozilla_ast: phase round-trips on ImportExpression", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_dynamic("./foo.wasm", "source"));
        const expr = ast.to_mozilla_ast().body[0].expression;
        assert.strictEqual(expr.type, "ImportExpression");
        assert.strictEqual(expr.phase, "source");
    });

    it("to_mozilla_ast: no `phase` on plain dynamic import", function() {
        const ast = AST.AST_Node.from_mozilla_ast(build_moz_dynamic("./mod.js", undefined));
        assert.strictEqual(ast.to_mozilla_ast().body[0].expression.phase, undefined);
    });

    it("minify accepts spidermonkey input with phase", async function() {
        const moz = build_moz_static("wasmModule", "./foo.wasm", "source");
        const result = await minify(moz, { parse: { spidermonkey: true }, compress: false, mangle: false });
        assert.strictEqual(result.code, 'import source wasmModule from"./foo.wasm";');
    });
});

describe("Source-phase imports (parse errors)", function() {
    it("rejects bare `import.source`", function() {
        assert.throws(() => parse('let x = import.source;'), /can only be used in a dynamic import/);
    });

    it("rejects bare `import.defer`", function() {
        assert.throws(() => parse('let x = import.defer;'), /can only be used in a dynamic import/);
    });
});
