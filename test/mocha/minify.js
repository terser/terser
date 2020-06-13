import assert from "assert";
import { readFileSync } from "fs";
import { run_code } from "../sandbox.js";
import { for_each_async } from "./utils.js";
import { minify } from "../../main.js";

function read(path) {
    return readFileSync(path, "utf8");
}

describe("minify", function() {
    it("Should test basic sanity of minify with default options", async function() {
        var js = 'function foo(bar) { if (bar) return 3; else return 7; var u = not_called(); }';
        var result = await minify(js);
        assert.strictEqual(result.code, 'function foo(n){return n?3:7}');
    });

    it("Should skip inherited keys from `files`", async function() {
        var files = Object.create({ skip: this });
        files[0] = "alert(1 + 1)";
        var result = await minify(files);
        assert.strictEqual(result.code, "alert(2);");
    });

    it("Should work with mangle.cache", async function() {
        var cache = {};
        var original = "";
        var compressed = "";
        await for_each_async([
            "bar.es5",
            "baz.es5",
            "foo.es5",
            "qux.js",
        ], async function(file) {
            var code = read("test/input/issue-1242/" + file);
            var result = await minify(code, {
                mangle: {
                    cache: cache,
                    toplevel: true
                }
            });
            if (result.error) throw result.error;
            original += code;
            compressed += result.code;
        });
        assert.strictEqual(JSON.stringify(cache).slice(0, 10), '{"props":{');
        assert.strictEqual(compressed, [
            "function n(n){return 3*n}",
            "function r(n){return n/2}",
            "var o=console.log.bind(console);",
            'function c(n){o("Foo:",2*n)}',
            "var a=n(3),b=r(12);",
            'o("qux",a,b),c(11);',
        ].join(""));
        assert.strictEqual(run_code(compressed), run_code(original));
    });

    it("Should work with nameCache", async function() {
        var cache = {};
        var original = "";
        var compressed = "";
        await for_each_async([
            "bar.es5",
            "baz.es5",
            "foo.es5",
            "qux.js",
        ], async function(file) {
            var code = read("test/input/issue-1242/" + file);
            var result = await minify(code, {
                mangle: {
                    toplevel: true
                },
                nameCache: cache
            });
            if (result.error) throw result.error;
            original += code;
            compressed += result.code;
        });
        assert.strictEqual(JSON.stringify(cache).slice(0, 18), '{"vars":{"props":{');
        assert.strictEqual(compressed, [
            "function n(n){return 3*n}",
            "function r(n){return n/2}",
            "var o=console.log.bind(console);",
            'function c(n){o("Foo:",2*n)}',
            "var a=n(3),b=r(12);",
            'o("qux",a,b),c(11);',
        ].join(""));
        assert.strictEqual(run_code(compressed), run_code(original));
    });

    it.skip("Should avoid mangled names in cache", async function() {
        var cache = {};
        var original = "";
        var compressed = "";
        await for_each_async([
            '"xxxyy";var i={s:1};',
            '"xxyyy";var j={t:2,u:3},k=4;',
            'console.log(i.s,j.t,j.u,k);',
        ], async function(code) {
            var result = await minify(code, {
                compress: false,
                mangle: {
                    properties: true,
                    toplevel: true
                },
                nameCache: cache
            });
            if (result.error) throw result.error;
            original += code;
            compressed += result.code;
        });
        assert.strictEqual(compressed, [
            '"xxxyy";var x={x:1};',
            '"xxyyy";var y={y:2,a:3},a=4;',
            'console.log(x.x,y.y,y.a,a);',
        ].join(""));
        assert.strictEqual(run_code(compressed), run_code(original));
    });

    it("Should not parse invalid use of reserved words", async function() {
        assert.strictEqual((await minify("function enum(){}")).error, undefined);
        assert.strictEqual((await minify("function static(){}")).error, undefined);
        assert.strictEqual((await minify("function super(){}")).error.message, "Unexpected token: name (super)");
        assert.strictEqual((await minify("function this(){}")).error.message, "Unexpected token: name (this)");
    });

    describe("keep_quoted_props", function() {
        it("Should preserve quotes in object literals", async function() {
            var js = 'var foo = {"x": 1, y: 2, \'z\': 3};';
            var result = await minify(js, {
                output: {
                    keep_quoted_props: true
                }});
            assert.strictEqual(result.code, 'var foo={"x":1,y:2,"z":3};');
        });

        it("Should preserve quote styles when quote_style is 3", async function() {
            var js = 'var foo = {"x": 1, y: 2, \'z\': 3};';
            var result = await minify(js, {
                output: {
                    keep_quoted_props: true,
                    quote_style: 3
                }});
            assert.strictEqual(result.code, 'var foo={"x":1,y:2,\'z\':3};');
        });

        it("Should not preserve quotes in object literals when disabled", async function() {
            var js = 'var foo = {"x": 1, y: 2, \'z\': 3};';
            var result = await minify(js, {
                output: {
                    keep_quoted_props: false,
                    quote_style: 3
                }});
            assert.strictEqual(result.code, 'var foo={x:1,y:2,z:3};');
        });
    });

    describe("mangleProperties", function() {
        it.skip("Shouldn't mangle quoted properties", async function() {
            var js = 'a["foo"] = "bar"; a.color = "red"; x = {"bar": 10};';
            var result = await minify(js, {
                compress: {
                    properties: false
                },
                mangle: {
                    properties: {
                        keep_quoted: true
                    }
                },
                output: {
                    keep_quoted_props: true,
                    quote_style: 3
                }
            });
            assert.strictEqual(result.code,
                    'a["foo"]="bar",a.a="red",x={"bar":10};');
        });
        it.skip("Should not mangle quoted property within dead code", async function() {
            var result = await minify('var g = {}; ({ "keep": 1 }); g.keep = g.change;', {
                mangle: {
                    properties: {
                        keep_quoted: true
                    }
                }
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, "var g={};g.keep=g.g;");
        });
    });

    describe("inSourceMap", function() {
        it("Should read the given string filename correctly when sourceMapIncludeSources is enabled (#1236)", async function() {
            var result = await minify(read("./test/input/issue-1236/simple.js"), {
                sourceMap: {
                    content: read("./test/input/issue-1236/simple.js.map"),
                    filename: "simple.min.js",
                    includeSources: true
                }
            });

            var map = JSON.parse(result.map);

            assert.equal(map.file, 'simple.min.js');
            assert.equal(map.sourcesContent.length, 1);
            assert.equal(map.sourcesContent[0],
                'let foo = x => "foo " + x;\nconsole.log(foo("bar"));');
        });
        it("Should process inline source map", async function() {
            var code = (await minify(read("./test/input/issue-520/input.js"), {
                compress: { toplevel: true },
                sourceMap: {
                    content: "inline",
                    url: "inline"
                }
            })).code + "\n";
            assert.strictEqual(code, readFileSync("test/input/issue-520/output.js", "utf8"));
        });
        it("Should fail with multiple input and inline source map", async function() {
            var result = await minify([
                read("./test/input/issue-520/input.js"),
                read("./test/input/issue-520/output.js")
            ], {
                sourceMap: {
                    content: "inline",
                    url: "inline"
                }
            });
            var err = result.error;
            assert.ok(err instanceof Error);
            assert.strictEqual(err.stack.split(/\n/)[0], "Error: inline source map only works with singular input");
        });
    });

    describe("sourceMapInline", function() {
        it("should append source map to output js when sourceMapInline is enabled", async function() {
            var result = await minify('var a = function(foo) { return foo; };', {
                sourceMap: {
                    url: "inline"
                }
            });
            var code = result.code;
            assert.strictEqual(code, "var a=function(n){return n};\n" +
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAiXSwibmFtZXMiOlsiYSIsImZvbyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsRUFBSSxTQUFTQyxHQUFPLE9BQU9BIn0=");
        });
        it("should not append source map to output js when sourceMapInline is not enabled", async function() {
            var result = await minify('var a = function(foo) { return foo; };');
            var code = result.code;
            assert.strictEqual(code, "var a=function(n){return n};");
        });
        it("should work with max_line_len", async function() {
            var result = await minify(read("./test/input/issue-505/input.js"), {
                compress: {
                    directives: false
                },
                output: {
                    max_line_len: 20
                },
                sourceMap: {
                    url: "inline"
                }
            });
            assert.strictEqual(result.error, undefined);
            assert.strictEqual(result.code, read("./test/input/issue-505/output.js"));
        });
    });

    describe("JS_Parse_Error", function() {
        it("Should return syntax error", async function() {
            var result = await minify("function f(a{}");
            var err = result.error;
            assert.ok(err instanceof Error);
            assert.strictEqual(err.stack.split(/\n/)[0], "SyntaxError: Unexpected token punc «{», expected punc «,»");
            assert.strictEqual(err.filename, "0");
            assert.strictEqual(err.line, 1);
            assert.strictEqual(err.col, 12);
        });
        it("Should reject duplicated label name", async function() {
            var result = await minify("L:{L:{}}");
            var err = result.error;
            assert.ok(err instanceof Error);
            assert.strictEqual(err.stack.split(/\n/)[0], "SyntaxError: Label L defined twice");
            assert.strictEqual(err.filename, "0");
            assert.strictEqual(err.line, 1);
            assert.strictEqual(err.col, 4);
        });
    });

    describe("global_defs", function() {
        it("Should throw for non-trivial expressions", async function() {
            var result = await minify("alert(42);", {
                compress: {
                    global_defs: {
                        "@alert": "debugger"
                    }
                }
            });
            var err = result.error;
            assert.ok(err instanceof Error);
            assert.strictEqual(err.stack.split(/\n/)[0], "SyntaxError: Unexpected token: keyword (debugger)");
        });
        it("Should skip inherited properties", async function() {
            var foo = Object.create({ skip: this });
            foo.bar = 42;
            var result = await minify("alert(FOO);", {
                compress: {
                    global_defs: {
                        FOO: foo
                    }
                }
            });
            assert.strictEqual(result.code, "alert({bar:42});");
        });
    });

    describe("duplicated block-scoped declarations", function() {
        [
            "let a=1;let a=2;",
            "let a=1;var a=2;",
            "var a=1;let a=2;",
            "let[a]=[1];var a=2;",
            "let a=1;var[a]=[2];",
            "let[a]=[1];var[a]=[2];",
            "const a=1;const a=2;",
            "const a=1;var a=2;",
            "var a=1;const a=2;",
            "const[a]=[1];var a=2;",
            "const a=1;var[a]=[2];",
            "const[a]=[1];var[a]=[2];",
        ].forEach(function(code) {
            it(code, async function() {
                var result = await minify(code, {
                    compress: false,
                    mangle: false
                });
                assert.strictEqual(result.error, undefined);
                assert.strictEqual(result.code, code);
                result = await minify(code);
                var err = result.error;
                assert.ok(err instanceof Error);
                assert.strictEqual(err.stack.split(/\n/)[0], `SyntaxError: "a" is redeclared`);
            });
        });
    });

    // rename is disabled on harmony due to expand_names bug in for-of loops
    if (0) describe("rename", function() {
        it("Should be repeatable", async function() {
            var code = "!function(x){return x(x)}(y);";
            for (var i = 0; i < 2; i++) {
                assert.strictEqual(await minify(code, {
                    compress: {
                        toplevel: true,
                    },
                    rename: true,
                }).code, "var a;(a=y)(a);");
            }
        });
    });

    it("should work with compress defaults disabled", async function() {
        var code = 'if (true) { console.log(1 + 2); }';
        var options = {
            compress: {
                defaults: false,
            }
        };
        assert.strictEqual((await minify(code, options)).code, 'if(true)console.log(1+2);');
    });

    it("should work with compress defaults disabled and evaluate enabled", async function() {
        var code = 'if (true) { console.log(1 + 2); }';
        var options = {
            compress: {
                defaults: false,
                evaluate: true,
            }
        };
        assert.strictEqual((await minify(code, options)).code, 'if(true)console.log(3);');
    });

    describe("enclose", function() {
        var code = read("test/input/enclose/input.js");
        it("Should work with true", async function() {
            var result = await minify(code, {
                compress: false,
                enclose: true,
                mangle: false,
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, '(function(){function enclose(){console.log("test enclose")}enclose()})();');
        });
        it("Should work with arg", async function() {
            var result = await minify(code, {
                compress: false,
                enclose: 'undefined',
                mangle: false,
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, '(function(undefined){function enclose(){console.log("test enclose")}enclose()})();');
        });
        it("Should work with arg:value", async function() {
            var result = await minify(code, {
                compress: false,
                enclose: 'window,undefined:window',
                mangle: false,
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, '(function(window,undefined){function enclose(){console.log("test enclose")}enclose()})(window);');
        });
        it("Should work alongside wrap", async function() {
            var result = await minify(code, {
                compress: false,
                enclose: 'window,undefined:window',
                mangle: false,
                wrap: 'exports',
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, '(function(window,undefined){(function(exports){function enclose(){console.log("test enclose")}enclose()})(typeof exports=="undefined"?exports={}:exports)})(window);');
        });
    });

    describe("for-await-of", function() {
        it("should fail in invalid contexts", async function() {
            await for_each_async([
                [ "async function f(x){ for await (e of x) {} }" ],
                [ "async function f(x){ for await (const e of x) {} }" ],
                [ "async function f(x){ for await (var e of x) {} }" ],
                [ "async function f(x){ for await (let e of x) {} }" ],
                [ "for await(e of x){}", "`for await` invalid in this context" ],
                [ "for await(const e of x){}", "`for await` invalid in this context" ],
                [ "for await(const e in x){}", "`for await` invalid in this context" ],
                [ "for await(;;){}", "`for await` invalid in this context" ],
                [ "function f(x){ for await (e of x) {} }", "`for await` invalid in this context" ],
                [ "function f(x){ for await (var e of x) {} }", "`for await` invalid in this context" ],
                [ "function f(x){ for await (const e of x) {} }", "`for await` invalid in this context" ],
                [ "function f(x){ for await (let e of x) {} }", "`for await` invalid in this context" ],
                [ "async function f(x){ for await (const e in x) {} }", "`for await` invalid in this context" ],
                [ "async function f(x){ for await (;;) {} }", "`for await` invalid in this context" ],
            ], async function(entry) {
                var code = entry[0];
                var expected_error = entry[1];
                var result = await minify(code);
                assert.strictEqual(result.error && result.error.message, expected_error, JSON.stringify(entry));
            });
        });
    });
});
