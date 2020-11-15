import assert from "assert";
import * as AST from "../../lib/ast.js";
import { parse } from "../../lib/parse.js";

describe("tokens", function() {
    it("Should give correct line in the face of DOS line endings \\r\\n", async () => {
        const end_at_line_2 = (code) => {
            const ast = parse(code);
            let found;
            ast.walk(new AST.TreeWalker(node => {
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

    it("Should give correct positions for accessors", async function() {
        // location             0         1         2         3         4
        //                      01234567890123456789012345678901234567890123456789
        var ast = parse("var obj = { get latest() { return undefined; } }");
        // test all AST_ObjectProperty tokens are set as expected
        var found = false;
        ast.walk(new AST.TreeWalker(function(node) {
            if (node instanceof AST.AST_ObjectProperty) {
                found = true;
                assert.equal(node.start.pos, 12);

                assert(node.key instanceof AST.AST_SymbolMethod);
                assert.equal(node.key.start.pos, 12);
                assert(node.value instanceof AST.AST_Accessor);
                assert.equal(node.value.start.pos, 22);
            }
        }));
        assert(found, "AST_ObjectProperty not found");
    });
});
