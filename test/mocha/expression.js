import assert from "assert";
import { parse } from "../../lib/parse.js";

describe("Expression", function() {
    it("Should not allow the first exponentiation operator to be prefixed with an unary operator", async function() {
        var tests = [
            "+5 ** 3",
            "-5 ** 3",
            "~5 ** 3",
            "!5 ** 3",
            "void 5 ** 3",
            "typeof 5 ** 3",
            "delete 5 ** 3",
            "var a = -(5) ** 3;"
        ];

        var fail = function(e) {
            return /^Unexpected token: operator \((?:[!+~-]|void|typeof|delete)\)/.test(e.message);
        }

        for (var i = 0; i < tests.length; i++) {
            assert.throws(() => parse(tests[i]), fail, tests[i]);
        }
    });
});
