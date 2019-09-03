var assert = require("assert");
var Terser = require("../..");

describe("let", function() {
    this.timeout(60000);
    it("Should not produce reserved keywords as variable name in mangle", function() {
        // Produce a lot of variables in a function and run it through mangle.
        var s = '"dddddeeeeelllllooooottttt"; function foo() {';
        for (var i = 0; i < 18000; i++) {
            s += "var v" + i + "=0;";
        }
        s += '}';
        var result = Terser.minify(s, {
            compress: false
        }).code;

        // Verify that select keywords and reserved keywords not produced
        [
            "do",
            "let",
            "var",
        ].forEach(function(name) {
            assert.strictEqual(result.indexOf("var " + name + "="), -1);
        });

        // Verify that the variable names that appeared immediately before
        // and after the erroneously generated variable name still exist
        // to show the test generated enough symbols.
        [
            "to", "eo",
            "eet", "fet",
            "rar", "oar",
        ].forEach(function(name) {
            assert.notStrictEqual(result.indexOf("var " + name + "="), -1);
        });
    });
});
