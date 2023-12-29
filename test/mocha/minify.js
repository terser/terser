import assert from "assert";
import { readFileSync } from "fs";
import { run_code } from "../sandbox.js";
import { for_each_async } from "./utils.js";
import { minify, minify_sync } from "../../main.js";

function read(path) {
    return readFileSync(path, "utf8");
}

describe("minify", function() {
    it("Should test basic sanity of minify with default options", async function() {
        var js = "function foo(bar) { if (bar) return 3; else return 7; var u = not_called(); }";
        var result = await minify(js);
        assert.strictEqual(result.code, "function foo(n){return n?3:7}");
    });

    it("Should have a sync version", function() {
        var js = "console.log(1 + 1);";
        var result = minify_sync(js);
        assert.strictEqual(result.code, "console.log(2);");
    });

    it("Should skip inherited keys from `files`", async function() {
        var files = Object.create({ skip: this });
        files[0] = "alert(1 + 1)";
        var result = await minify(files);
        assert.strictEqual(result.code, "alert(2);");
    });

    it("Should not mutate options", async function () {
        const options = { compress: true };
        const options_snapshot = JSON.stringify(options);

        await minify("x()", options);

        assert.strictEqual(JSON.stringify(options), options_snapshot);
    });

    it("Should not mutate options, BUT mutate the nameCache", async function () {
        const nameCache = {};

        const options = {
            nameCache,
            toplevel: true,
            mangle: {
                properties: true
            },
            compress: false
        };

        await minify("const a_var = { a_prop: 'long' }", options);

        assert.deepEqual(Object.keys(nameCache.vars.props), ["$a_var"]);
        assert.deepEqual(Object.keys(nameCache.props.props), ["$a_prop"]);
    });

    it("Should be able to use a dotted property to reach nameCache", async function () {
        const nameCache = {};

        const options = {
            nameCache,
            toplevel: true,
            mangle: {
                properties: true
            },
            compress: false
        };

        await minify("const a_var = { a_prop: 'long' }", options);

        assert.deepEqual(Object.keys(options.nameCache.vars.props), ["$a_var"]);
        assert.deepEqual(Object.keys(options.nameCache.props.props), ["$a_prop"]);
    });

    it("Should accept new `format` options as well as `output` options", async function() {
        const { code } = await minify("x(1,2);", { format: { beautify: true }});
        assert.strictEqual(code, "x(1, 2);");
    });

    it("Should refuse `format` and `output` option together", async function() {
        await assert.rejects(() => minify("x(1,2);", { format: { beautify: true }, output: { beautify: true } }));
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

    it("Should avoid mangled names in cache", async function() {
        var cache = {};
        var original = "";
        var compressed = "";
        const nth_identifier = {
            get(n) {
                return String.fromCharCode(n + "a".charCodeAt(0));
            }
        };

        await for_each_async([
            '"xxxyy";var i={prop1:1};',
            '"xxyyy";var j={prop2:2,prop3:3},k=4;',
            "console.log(i.prop1,j.prop2,j.prop3,k);",
            "console.log(i.prop2 === undefined, j.prop1 === undefined);",
        ], async function(code) {
            var result = await minify(code, {
                compress: false,
                mangle: {
                    properties: {
                        nth_identifier,
                    },
                    toplevel: true,
                },
                nameCache: cache
            });
            original += code;
            compressed += result.code;
        });
        assert.strictEqual(compressed, [
            '"xxxyy";var x={h:1};',
            '"xxyyy";var p={i:2,j:3},r=4;',
            "console.log(x.h,p.i,p.j,r);",
            "console.log(x.i===undefined,p.h===undefined);"
        ].join(""));
        assert.strictEqual(run_code(compressed), run_code(original));
    });

    it("Should consistently rename properties colliding with a mangled name", async function() {
        var cache = {};
        var original = "";
        var compressed = "";

        await for_each_async([
            "function fn1(obj) { obj.prop = 1; obj.i = 2; }",
            "function fn2(obj) { obj.prop = 1; obj.i = 2; }",
            "let o1 = {}, o2 = {}; fn1(o1); fn2(o2);",
            "console.log(o1.prop === o2.prop, o2.prop === 1, o1.i === o2.i, o2.i === 2);",
        ], async function(code) {
            var result = await minify(code, {
                compress: false,
                mangle: {
                    properties: true,
                    toplevel: true
                },
                nameCache: cache
            });
            original += code;
            compressed += result.code;
        });
        assert.strictEqual(compressed, [
            // It's important that the `n.i` here conflicts with the original's
            // `obj.i`, so `obj.i` gets consistently renamed to `n.o`.
            "function n(n){n.i=1;n.o=2}",
            "function c(n){n.i=1;n.o=2}",
            "let f={},e={};n(f);c(e);",
            "console.log(f.i===e.i,e.i===1,f.o===e.o,e.o===2);",
        ].join(""));
        assert.equal(run_code(compressed), run_code(original));
    });

    it("Should not parse invalid use of reserved words", async function() {
        await assert.doesNotReject(() => minify("function enum(){}"));
        await assert.doesNotReject(() => minify("function static(){}"));
        await assert.rejects(() => minify("function super(){}"), {message: "Unexpected token: name (super)" });
        await assert.rejects(() => minify("function this(){}"), {message: "Unexpected token: name (this)" });
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
            assert.strictEqual(result.code, "var foo={x:1,y:2,z:3};");
        });
    });

    describe("mangleProperties", function() {
        it("Shouldn't mangle quoted properties", async function() {
            var js = 'var a = {}; a["foo"] = "bar"; a.color = "red"; x = {"bar": 10};';
            var result = await minify(js, {
                compress: {
                    properties: false
                },
                mangle: {
                    properties: {
                        builtins: true,
                        keep_quoted: true
                    }
                },
                output: {
                    keep_quoted_props: true,
                    quote_style: 3
                }
            });
            assert.strictEqual(result.code,
                    'var a={foo:"bar",r:"red"};x={"bar":10};');
        });

        it("Should not mangle quoted property within dead code", async function() {
            var result = await minify('var g = {}; ({ "keep": 1 }); g.keep = g.change;', {
                mangle: {
                    properties: {
                        keep_quoted: true
                    }
                }
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, "var g={};g.keep=g.v;");
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

            assert.equal(map.file, "simple.min.js");
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
        it("Should process inline source map (minify_sync)", function() {
            var code = minify_sync(read("./test/input/issue-520/input.js"), {
                compress: { toplevel: true },
                sourceMap: {
                    content: "inline",
                    url: "inline"
                }
            }).code + "\n";
            assert.strictEqual(code, readFileSync("test/input/issue-520/output.js", "utf8"));
        });
        it("Should fail with multiple input and inline source map", async function() {
            await assert.rejects(
                () =>
                    minify([
                        read("./test/input/issue-520/input.js"),
                        read("./test/input/issue-520/output.js")
                    ], {
                        sourceMap: {
                            content: "inline",
                            url: "inline"
                        }
                    }),
                { message: "inline source map only works with singular input" }
            );
        });
    });

    describe("sourceMapInline", function() {
        it("should append source map to output js when sourceMapInline is enabled", async function() {
            var result = await minify("var a = function(foo) { return foo; };", {
                sourceMap: {
                    url: "inline"
                }
            });
            var code = result.code;
            assert.strictEqual(code, "var a=function(n){return n};\n" +
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhIiwiZm9vIl0sInNvdXJjZXMiOlsiMCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsRUFBSSxTQUFTQyxHQUFPLE9BQU9BLENBQUsifQ==");
        });
        it("should not append source map to output js when sourceMapInline is not enabled", async function() {
            var result = await minify("var a = function(foo) { return foo; };");
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
            await assert.rejects(
                () => minify("function f(a{}"),
                {message: "Unexpected token punc «{», expected punc «,»"}
            );
        });
        it("Should reject duplicated label name", async function() {
            await assert.rejects(
                () => minify("L:{L:{}}"),
                {message: "Label L defined twice"}
            );
        });
    });

    describe("global_defs", function() {
        it("Should throw for non-trivial expressions", async function() {
            await assert.rejects(
                () => minify("alert(42);", {
                    compress: {
                        global_defs: {
                            "@alert": "debugger"
                        }
                    }
                }),
                { message: "Unexpected token: keyword (debugger)"}
            );
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

    it("duplicated block-scoped declarations", async () => {
        await for_each_async([
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
        ], async code => {
            await assert.doesNotReject(
                () => minify(code, {
                    compress: false,
                    mangle: false
                }),
                JSON.stringify(code) + " should be compressed"
            );
            await assert.rejects(
                () => minify(code),
                { message: '"a" is redeclared' },
                JSON.stringify(code) + " should throw a SyntaxError"
            );
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
        var code = "if (true) { console.log(1 + 2); }";
        var options = {
            compress: {
                defaults: false,
            }
        };
        assert.strictEqual((await minify(code, options)).code, "if(true)console.log(1+2);");
    });

    it("should work with compress defaults disabled and evaluate enabled", async function() {
        var code = "if (true) { console.log(1 + 2); }";
        var options = {
            compress: {
                defaults: false,
                evaluate: true,
            }
        };
        assert.strictEqual((await minify(code, options)).code, "if(true)console.log(3);");
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
                enclose: "undefined",
                mangle: false,
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, '(function(undefined){function enclose(){console.log("test enclose")}enclose()})();');
        });
        it("Should work with arg:value", async function() {
            var result = await minify(code, {
                compress: false,
                enclose: "window,undefined:window",
                mangle: false,
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, '(function(window,undefined){function enclose(){console.log("test enclose")}enclose()})(window);');
        });
        it("Should work alongside wrap", async function() {
            var result = await minify(code, {
                compress: false,
                enclose: "window,undefined:window",
                mangle: false,
                wrap: "exports",
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

                if (!expected_error) {
                    await assert.doesNotReject(() => minify(code));
                } else {
                    await assert.rejects(
                        () => minify(code),
                        {message: expected_error},
                        JSON.stringify(entry)
                    );
                }
            });
        });
    });
});
