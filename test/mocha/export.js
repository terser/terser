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

    it("Should parse export with classes and functions", async function() {
        var inputs = [
            ["export class X {}", "export class X{}"],
            ["export function X(){}", "export function X(){}"],
            ["export default function X(){}", "export default function X(){}"],
            ["export default class X{}", "export default class X{}"],
            ["export default class X extends Y{}", "export default class X extends Y{}"],
            ["export default class extends Y{}", "export default class extends Y{}"],
        ];

        for (const [input, output] of inputs) {
            const minified = await minify(input);

            assert.equal(minified.code, output);
        }
    });

    it("Should not parse invalid uses of export", async function() {
        await assert.rejects(() => minify("export"), { message: "Unexpected token: eof (undefined)" });
        await assert.rejects(() => minify("export;"), { message: "Unexpected token: punc (;)" });
        await assert.rejects(() => minify("export();"), { message: "Unexpected token: keyword (export)" });
        await assert.rejects(() => minify("export(1);"), { message: "Unexpected token: keyword (export)" });
        await assert.rejects(() => minify("var export;"), { message: "Name expected" });
        await assert.rejects(() => minify("var export = 1;"), { message: "Name expected" });
        await assert.rejects(() => minify("function f(export){}"), { message: "Invalid function parameter" });
    });

    it("Should not parse invalid uses of import", async function() {
        await assert.rejects(() => minify("import"), { message: "Unexpected token: eof (undefined)" });
        await assert.rejects(() => minify("import;"), { message: "Unexpected token: punc (;)" });
        await assert.rejects(() => minify("var import;"), { message: "Unexpected token: import" });
        await assert.rejects(() => minify("var import = 1;"), { message: "Unexpected token: import" });
        await assert.rejects(() => minify("function f(import){}"), { message: "Unexpected token: name (import)" });
    });
});
