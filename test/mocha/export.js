import assert from "assert";
import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";
import * as AST from "../../lib/ast.js";

describe("Export/Import", function() {
    it("Should parse export directives", async function() {
        var inputs = [
            ['export * from "a.js"', ['*'], "a.js"],
            ['export {A} from "a.js"', ['A'], "a.js"],
            ['export {A as X} from "a.js"', ['X'], "a.js"],
            ['export {A as Foo, B} from "a.js"', ['Foo', 'B'], "a.js"],
            ['export {A, B} from "a.js"', ['A', 'B'], "a.js"],
        ];

        function test(code) {
            return parse(code);
        }

        function extractNames(symbols) {
            var ret = [];
            for (var i = 0; i < symbols.length; i++) {
                ret.push(symbols[i].foreign_name.name);
            }
            return ret;
        }

        for (var i = 0; i < inputs.length; i++) {
            var ast = test(inputs[i][0]);
            var names = inputs[i][1];
            var filename = inputs[i][2];
            assert(ast instanceof AST.AST_Toplevel);
            assert.equal(ast.body.length, 1);
            var st = ast.body[0];
            assert(st instanceof AST.AST_Export);
            var actualNames = extractNames(st.exported_names);
            assert.deepEqual(actualNames, names);
            assert.equal(st.module_name.value, filename);
        }
    });

    it("Should not parse invalid uses of export", async function() {
        assert.equal((await minify("export")).error.message, "Unexpected token: eof (undefined)");
        assert.equal((await minify("export;")).error.message, "Unexpected token: punc (;)");
        assert.equal((await minify("export();")).error.message, "Unexpected token: keyword (export)");
        assert.equal((await minify("export(1);")).error.message, "Unexpected token: keyword (export)");
        assert.equal((await minify("var export;")).error.message, "Name expected");
        assert.equal((await minify("var export = 1;")).error.message, "Name expected");
        assert.equal((await minify("function f(export){}")).error.message, "Invalid function parameter");
    });

    it("Should not parse invalid uses of import", async function() {
        assert.equal((await minify("import")).error.message, "Unexpected token: eof (undefined)");
        assert.equal((await minify("import;")).error.message, "Unexpected token: punc (;)");
        assert.equal((await minify("var import;")).error.message, "Unexpected token: import");
        assert.equal((await minify("var import = 1;")).error.message, "Unexpected token: import");
        assert.equal((await minify("function f(import){}")).error.message, "Unexpected token: name (import)");
    });
});
