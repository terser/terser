var assert = require("assert");
var Terser = require("../..");

describe("tokens", function() {
    it("Should give correct positions for accessors", function() {
        // location               0         1         2         3         4
        //                        01234567890123456789012345678901234567890123456789
        var ast = Terser.parse("var obj = { get latest() { return undefined; } }");
        // test all AST_ObjectProperty tokens are set as expected
        var found = false;
        ast.walk(new Terser.TreeWalker(function(node) {
            if (node instanceof Terser.AST_ObjectProperty) {
                found = true;
                assert.equal(node.start.pos, 12);
                assert.equal(node.end.endpos, 46);

                assert(node.key instanceof Terser.AST_SymbolMethod);
                assert.equal(node.key.start.pos, 12);
                assert.equal(node.key.end.endpos, 22);
                assert(node.value instanceof Terser.AST_Accessor);
                assert.equal(node.value.start.pos, 22);
                assert.equal(node.value.end.endpos, 46);
            }
        }));
        assert(found, "AST_ObjectProperty not found");
    });
});
