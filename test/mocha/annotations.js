const assert = require("assert");
const Terser = require("../../");
const { _PURE, _INLINE, _NOINLINE, _has_annotation } = Terser;

describe("annotations", () => {
    describe("#__PURE__", function() {
        it("Should add a 'pure' annotation to the AST node", () => {
            const ast = Terser.parse("/*@__PURE__*/foo.bar.baz();impure()");
            const [{body: call}, {body: call2}] = ast.body;
            assert(_has_annotation(call, _PURE));
            assert(!_has_annotation(call2, _PURE));
        });
    });
    describe("#__INLINE__", () => {
        it("Adds an annotation", () => {
            const ast = Terser.parse("/*@__INLINE__*/foo();");
            const [{body: call}] = ast.body;
            assert(_has_annotation(call, _INLINE));
        });
    });
    describe("#__NOINLINE__", () => {
        it("Adds an annotation", () => {
            const ast = Terser.parse("/*@__NOINLINE__*/foo();");
            const [{body: call}] = ast.body;
            assert(_has_annotation(call, _NOINLINE));
        });
    });
});
