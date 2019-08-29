var assert = require("assert");
var Terser = require("../node");

describe("New", function() {
    it("Should check target in new.target", function() {
        assert.throws(function() {Terser.parse("new.blah")}, function(e) {
            return e instanceof Terser._JS_Parse_Error
                && e.message === "Unexpected token name «blah», expected name «target»";
        });
    });
});
