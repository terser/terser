var assert = require("assert");
var terser = require("../node");

describe("Try", function() {
    it("Should not allow catch with an empty parameter", function() {
        var tests = [
            "try {} catch() {}"
        ];

        var test = function(code) {
            return function () {
                terser.parse(code);
            }
        }
        var error = function (e) {
            return e instanceof terser._JS_Parse_Error;
        }
        for (var i = 0; i < tests.length; i++) {
            assert.throws(test(tests[i]), error, tests[i]);
        }
    });
});
