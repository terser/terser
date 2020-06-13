import assert from "assert";
import { parse } from "../../lib/parse.js";
import { _PURE, _INLINE, _NOINLINE } from "../../lib/ast.js";
import { has_annotation } from "../../lib/utils/index.js";

describe("annotations", () => {
    describe("#__PURE__", function() {
        it("Should add a 'pure' annotation to the AST node", () => {
            const ast = parse("/*@__PURE__*/foo.bar.baz();impure()");
            const [{body: call}, {body: call2}] = ast.body;
            assert(has_annotation(call, _PURE));
            assert(!has_annotation(call2, _PURE));
        });
    });
    describe("#__INLINE__", () => {
        it("Adds an annotation", () => {
            const ast = parse("/*@__INLINE__*/foo();");
            const [{body: call}] = ast.body;
            assert(has_annotation(call, _INLINE));
        });
    });
    describe("#__NOINLINE__", () => {
        it("Adds an annotation", () => {
            const ast = parse("/*@__NOINLINE__*/foo();");
            const [{body: call}] = ast.body;
            assert(has_annotation(call, _NOINLINE));
        });
    });
});
