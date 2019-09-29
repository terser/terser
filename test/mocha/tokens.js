var assert = require("assert");
var terser = require("../..");

describe("tokens", function() {
    it("Should give correct line in the face of DOS line endings \\r\\n", () => {
        const end_at_line_2 = (code) => {
            const ast = terser.parse(code);
            let found;
            ast.walk(new terser.TreeWalker(node => {
                if (node.name === "end") {
                    assert.equal(node.start.line, 2);
                    found = true;
                }
            }));
            assert(found);
        };
        end_at_line_2("`A\nB`;end");
        end_at_line_2("`A\r\nB`;end");
        end_at_line_2("`A\\\nB`;end");
        end_at_line_2("`A\\\r\nB`;end");
        end_at_line_2("'A\\\nB';end");
        end_at_line_2("'A\\\r\nB';end");
    });

    it("Should give correct positions for accessors", function() {
        // location             0         1         2         3         4
        //                      01234567890123456789012345678901234567890123456789
        var ast = terser.parse("var obj = { get latest() { return undefined; } }");
        // test all AST_ObjectProperty tokens are set as expected
        var found = false;
        ast.walk(new terser.TreeWalker(function(node) {
            if (node instanceof terser.AST_ObjectProperty) {
                found = true;
                assert.equal(node.start.pos, 12);
                assert.equal(node.end.endpos, 46);

                assert(node.key instanceof terser.AST_SymbolMethod);
                assert.equal(node.key.start.pos, 12);
                assert.equal(node.key.end.endpos, 22);
                assert(node.value instanceof terser.AST_Accessor);
                assert.equal(node.value.start.pos, 22);
                assert.equal(node.value.end.endpos, 46);
            }
        }));
        assert(found, "AST_ObjectProperty not found");
    });
});
