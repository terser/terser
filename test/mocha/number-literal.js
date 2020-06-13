import assert from "assert";
import { parse } from "../../lib/parse.js";

describe("Number literals", function () {
    it("Should not allow legacy octal literals in strict mode", async function() {
        var inputs = [
            '"use strict";00;',
            '"use strict"; var foo = 00;'
        ];

        var error = function(e) {
            return e.message === "Legacy octal literals are not allowed in strict mode";
        };
        for (var i = 0; i < inputs.length; i++) {
            assert.throws(() => parse(inputs[i]), error, inputs[i]);
        }
    });
});
