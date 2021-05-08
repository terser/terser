import assert from "assert";
import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";

describe("Object", function() {
    it("Should allow objects to have a methodDefinition as property", async () => {
        var code = "var a = {test() {return true;}}";
        assert.equal((await minify(code, {
            compress: {
                arrows: false
            }
        })).code, "var a={test(){return!0}};");
    });

    it("Should not allow objects to use static keywords like in classes", async () => {
        var code = "{static test() {}}";
        assert.throws(() => parse(code));
    });

    it("Should not allow objects to have static computed properties like in classes", async () => {
        var code = "var foo = {static [123](){}}";
        assert.throws(() => parse(code));
    });

    it("Should be able to use shorthand properties", async () => {
        var ast = parse("var foo = 123\nvar obj = {foo: foo}");
        assert.strictEqual(ast.print_to_string({ecma: 2015}), "var foo=123;var obj={foo};");
    });
});
