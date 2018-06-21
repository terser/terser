var assert = require("assert");
var UglifyJS = require("../node");

describe("New", function() {
    it("Should check target in new.target", function() {
        assert.throws(function() {UglifyJS.parse("new.blah")}, function(e) {
            return e instanceof UglifyJS.JS_Parse_Error
                && e.message === "Unexpected token name «blah», expected name «target»";
        });
    });
});
