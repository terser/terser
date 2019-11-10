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
        it("Should drop #__PURE__ hint after use", function() {
            var result = Terser.minify("//@__PURE__ comment1 #__PURE__ comment2\n foo(), bar();", {
                output: {
                    comments: "all",
                    beautify: false,
                }
            });
            var code = result.code;
            assert.strictEqual(code, "//  comment1   comment2\nbar();");
        });
        it("Should drop #__PURE__ hint if function is retained", function() {
            var result = Terser.minify("var a = /*#__PURE__*/(function(){ foo(); })();", {
                output: {
                    comments: "all",
                    beautify: false,
                }
            });
            var code = result.code;
            assert.strictEqual(code, "var a=/* */function(){foo()}();");
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
