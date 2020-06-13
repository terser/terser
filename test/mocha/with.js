import assert from "assert";
import "../../main.js";
import { parse } from "../../lib/parse.js";

describe("With", function() {
    it("Should throw syntaxError when using with statement in strict mode", async function() {
        var code = '"use strict";\nthrow NotEarlyError;\nwith ({}) { }';
        var error = function(e) {
            return e.message === "Strict mode may not include a with statement";
        }
        assert.throws(() => parse(code), error);
    });
    it("Should set uses_with for scopes involving With statements", async function() {
        var ast = parse("with(e) {f(1, 2)}");
        ast.figure_out_scope();
        assert.equal(ast.uses_with, true);
        assert.equal(ast.body[0].expression.scope.uses_with, true);
        assert.equal(ast.body[0].body.body[0].body.expression.scope.uses_with, true);
    });
});
