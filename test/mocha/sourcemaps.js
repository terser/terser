import assert from "assert";
import { readFileSync } from "fs";
import source_map_module from "source-map";
import { assertCodeWithInlineMapEquals } from "./utils.js";
import { to_ascii } from "../../lib/minify.js";
import { minify, minify_sync } from "../../main.js";

const { SourceMapConsumer } = source_map_module;

function read(path) {
    return readFileSync(path, "utf8");
}

async function source_map(code) {
    return JSON.parse((await minify(code, {
        compress: false,
        mangle: false,
        sourceMap: true,
    })).map);
}

function get_map() {
    return {
        "version": 3,
        "sources": ["index.js"],
        "names": [],
        "mappings": ";;AAAA,IAAI,MAAM,SAAN,GAAM;AAAA,SAAK,SAAS,CAAd;AAAA,CAAV;AACA,QAAQ,GAAR,CAAY,IAAI,KAAJ,CAAZ",
        "file": "bundle.js",
        "sourcesContent": ["let foo = x => \"foo \" + x;\nconsole.log(foo(\"bar\"));"]
    };
}

function get_sections_map() {
    return {
        "version": 3,
        "file": "bundle-outer.js",
        "sections": [
            {
                "offset": {
                    "line": 0,
                    "column": 0
                },
                "map": get_map()
            }
        ]
    };
}

async function prepare_map(sourceMap) {
    var code = [
        '"use strict";',
        "",
        "var foo = function foo(x) {",
        '  return "foo " + x;',
        "};",
        'console.log(foo("bar"));',
        "",
        "//# sourceMappingURL=bundle.js.map",
    ].join("\n");
    var result = await minify(code, {
        sourceMap: {
            content: sourceMap,
            includeSources: true,
        }
    });
    if (result.error) throw result.error;
    return new SourceMapConsumer(result.map);
}

describe("sourcemaps", function() {
    it("Should give correct version", async function() {
        var map = await source_map("var x = 1 + 1;");
        assert.strictEqual(map.version, 3);
        assert.deepEqual(map.names, [ "x" ]);
    });
    it("Should give correct names", async function() {
        var map = await source_map([
            "({",
            "    get enabled() {",
            "        return 3;",
            "    },",
            "    set enabled(x) {",
            "        ;",
            "    }",
            "});",
        ].join("\n"));
        assert.deepEqual(map.names, [ "enabled", "x" ]);
    });
    it("Should mark array/object literals", async function() {
        var result = await minify([
            "var obj = {};",
            "obj.wat([]);",
        ].join("\n"), {
            sourceMap: true,
            toplevel: true,
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, "({}).wat([]);");
        assert.deepStrictEqual(JSON.parse(result.map), {
            version: 3,
            sources: ["0"],
            names: ["wat"],
            mappings: "CAAU,CAAC,GACPA,IAAI",
        });
    });
    it("Should mark class literals", async function() {
        var result = await minify([
            "class bar {};",
            "var obj = class {};",
            "obj.wat(bar);",
        ].join("\n"), {
            sourceMap: true,
            toplevel: true,
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, "(class{}).wat(class{});");
        assert.deepStrictEqual(JSON.parse(result.map), {
            version: 3,
            sources: ["0"],
            names: ["wat"],
            mappings: "CACU,SACNA,IAFJ",
        });
    });
    it("Should give correct sourceRoot", async function() {
        var code = "console.log(42);";
        var result = await minify(code, {
            sourceMap: {
                root: "//foo.bar/",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, code);
        assert.deepStrictEqual(JSON.parse(result.map), {
            version: 3,
            sources: ["0"],
            names: ["console","log"],
            mappings: "AAAAA,QAAQC,IAAI",
            sourceRoot: "//foo.bar/",
        });
    });
    it("Should return source map as object when asObject is given", async function() {
        var code = "console.log(42);";
        var result = await minify(code, {
            sourceMap: {
                asObject: true,
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, code);
        assert.deepStrictEqual(result.map, {
            version: 3,
            sources: ["0"],
            names: ["console","log"],
            mappings: "AAAAA,QAAQC,IAAI",
        });
    });
    it("Should return source map as object when asObject is given (minify_sync)", function() {
        var code = "console.log(42);";
        var result = minify_sync(code, {
            sourceMap: {
                asObject: true,
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, code);
        assert.deepStrictEqual(result.map, {
            version: 3,
            sources: ["0"],
            names: ["console","log"],
            mappings: "AAAAA,QAAQC,IAAI",
        });
    });

    it("Should grab names from methods and properties correctly", async () => {
        const code = `class Foo {
            property = 6
            method () {}
            async async_method() {}
            static static_method() {}
            404() {}
            "quoted method name" () {}
            get getter(){}
            set setter(){}
            #private = 4
            #private_method() {}
            get #private_getter() {}
            set #private_setter() {}

            test() {
                this.property;
                this.method;
                this.async_method;
                this.static_method;
                this[404];
                this["quoted method name"];
                this.getter;
                this.setter;
                this.#private;
                this.#private_method;
                this.#private_getter;
                this.#private_setter;
            }
        }`;
        const result = await minify(code, {
            sourceMap: { asObject: true },
            mangle: { properties: true },
        });
        assert.deepStrictEqual(result.map.names, [
            "Foo",
            "property",
            "method",
            "async_method",
            "static_method",
            "getter",
            "setter",
            "private",
            "private_method",
            "private_getter",
            "private_setter",
            "test",
            "this",
        ]);
    });

    describe("inSourceMap", function() {
        it("Should read the given string filename correctly when sourceMapIncludeSources is enabled", async function() {
            var result = await minify(read("./test/input/issue-1236/simple.js"), {
                sourceMap: {
                    content: read("./test/input/issue-1236/simple.js.map"),
                    filename: "simple.min.js",
                    includeSources: true
                }
            });
            if (result.error) throw result.error;
            var map = JSON.parse(result.map);
            assert.equal(map.file, "simple.min.js");
            assert.deepEqual(map.sources, ["index.js"]);
            assert.deepEqual(map.sourcesContent, ['let foo = x => "foo " + x;\nconsole.log(foo("bar"));']);
        });
        it("Should process inline source map", async function() {
            var result = await minify(read("./test/input/issue-520/input.js"), {
                compress: { toplevel: true },
                sourceMap: {
                    content: "inline",
                    includeSources: true,
                    url: "inline"
                }
            });
            if (result.error) throw result.error;
            assertCodeWithInlineMapEquals(result.code + "\n", readFileSync("test/input/issue-520/output.js", "utf8"));
        });
    });

    describe("sourceMapInline", function() {
        it("Should append source map to output js when sourceMapInline is enabled", async function() {
            var result = await minify("var a = function(foo) { return foo; };", {
                sourceMap: {
                    url: "inline"
                }
            });
            if (result.error) throw result.error;
            var code = result.code;
            assertCodeWithInlineMapEquals(code, "var a=function(n){return n};\n" +
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAiXSwibmFtZXMiOlsiYSIsImZvbyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsRUFBSSxTQUFTQyxHQUFPLE9BQU9BLENBQUsifQ==");
        });
        it("Should not append source map to output js when sourceMapInline is not enabled", async function() {
            var result = await minify("var a = function(foo) { return foo; };");
            if (result.error) throw result.error;
            var code = result.code;
            assertCodeWithInlineMapEquals(code, "var a=function(n){return n};");
        });
        it("Should work with max_line_len", async function() {
            var result = await minify(read("./test/input/issue-505/input.js"), {
                compress: {
                    directives: false,
                },
                output: {
                    max_line_len: 20
                },
                sourceMap: {
                    url: "inline"
                }
            });
            if (result.error) throw result.error;
            assertCodeWithInlineMapEquals(result.code, read("./test/input/issue-505/output.js"));
        });
        it("Should work with unicode characters", async function() {
            var code = [
                "var tëst = '→unicøde←';",
                "alert(tëst);",
            ].join("\n");
            var result = await minify(code, {
                sourceMap: {
                    includeSources: true,
                    url: "inline",
                }
            });
            if (result.error) throw result.error;
            var map = JSON.parse(result.map);
            assert.strictEqual(map.sourcesContent.length, 1);
            assert.strictEqual(map.sourcesContent[0], code);
            var encoded = result.code.slice(result.code.lastIndexOf(",") + 1);
            map = JSON.parse(to_ascii(encoded).toString());
            assert.strictEqual(map.sourcesContent.length, 1);
            assert.strictEqual(map.sourcesContent[0], code);
            result = await minify(result.code, {
                sourceMap: {
                    content: "inline",
                    includeSources: true,
                }
            });
            if (result.error) throw result.error;
            map = JSON.parse(result.map);
            assert.strictEqual(map.names.length, 1);
            // We don't add non-ascii-identifier names
            // assert.strictEqual(map.names[0], "tëst");
            assert.strictEqual(map.names[0], "alert");
        });
        it("Should append source map to file when asObject is present", async function() {
            var result = await minify("var a = function(foo) { return foo; };", {
                sourceMap: {
                    url: "inline",
                    asObject: true
                }
            });
            if (result.error) throw result.error;
            var code = result.code;
            assertCodeWithInlineMapEquals(code, "var a=function(n){return n};\n" +
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAiXSwibmFtZXMiOlsiYSIsImZvbyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsRUFBSSxTQUFTQyxHQUFPLE9BQU9BLENBQUsifQ==");
        });
    });

    describe("input sourcemaps", function() {
        it("Should copy over original sourcesContent", async function() {
            var orig = get_map();
            var map = await prepare_map(orig);
            assert.equal(map.sourceContentFor("index.js"), orig.sourcesContent[0]);
        });
        it("Should copy over original sourcesContent for section sourcemaps", async function() {
            var orig = get_sections_map();
            var map = await prepare_map(orig);
            assert.equal(map.sourceContentFor("index.js"), orig.sections[0].map.sourcesContent[0]);
        });
        it("Should copy sourcesContent if sources are relative", async function() {
            var relativeMap = get_map();
            relativeMap.sources = ["./index.js"];
            var map = await prepare_map(relativeMap);
            assert.notEqual(map.sourcesContent, null);
            assert.equal(map.sourcesContent.length, 1);
            assert.equal(map.sourceContentFor("index.js"), relativeMap.sourcesContent[0]);
        });
        it("Should not have invalid mappings from inputSourceMap", async function() {
            var map = await prepare_map(get_map());
            // The original source has only 2 lines, check that mappings don't have more lines
            var msg = "Mapping should not have higher line number than the original file had";
            map.eachMapping(function(mapping) {
                assert.ok(mapping.originalLine <= 2, msg);
            });
            map.allGeneratedPositionsFor({
                source: "index.js",
                line: 1,
                column: 1
            }).forEach(function(pos) {
                assert.ok(pos.line <= 2, msg);
            });
        });
    });
});
