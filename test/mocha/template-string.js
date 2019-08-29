var assert = require("assert");
var terser = require("../node");

describe("Template string", function() {
    it("Should not accept invalid sequences", function() {
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
                terser.parse(test);
            }
        };

        var fail = function(e) {
            return e instanceof terser._JS_Parse_Error
                && /^Unexpected token: /.test(e.message);
        };

        for (var i = 0; i < tests.length; i++) {
            assert.throws(exec(tests[i]), fail, tests[i]);
        }
    });
    it("Should process all line terminators as LF", function() {
        [
            "`a\rb`",
            "`a\nb`",
            "`a\r\nb`",
        ].forEach(function(code) {
            assert.strictEqual(terser.parse(code).print_to_string(), "`a\\nb`;");
        });
    });
    it("Should not throw on extraneous escape (#231)", function() {
        assert.doesNotThrow(function() {
            terser.parse("`\\a`");
        });
    });
});
