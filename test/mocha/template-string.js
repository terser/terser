import assert from "assert";
import "../../main.js";
import { parse } from "../../lib/parse.js";

describe("Template string", function() {
    it("Should not accept invalid sequences", async function() {
        var tests = [
            // Stress invalid expression
            "var foo = `Hello ${]}`",
            "var foo = `Test 123 ${>}`",
            "var foo = `Blah ${;}`",

            // Stress invalid template_substitution after expression
            "var foo = `Blablabla ${123 456}`",
            "var foo = `Blub ${123;}`",
            "var foo = `Bleh ${a b}`"
        ];

        var exec = function(test) {
            return function() {
                parse(test);
            };
        };

        var fail = function(e) {
            return /^Unexpected token: /.test(e.message);
        };

        for (const test of tests) {
            assert.throws(() => parse(test), fail, test);
        }
    });
    it("Should process all line terminators as LF", async function() {
        [
            "`a\rb`",
            "`a\nb`",
            "`a\r\nb`",
        ].forEach(function(code) {
            assert.strictEqual(parse(code).print_to_string(), "`a\\nb`;");
        });
    });
    it("Should not throw on extraneous escape (#231)", async function() {
        assert.doesNotThrow(function() {
            parse("`\\a`");
        });
    });
});
