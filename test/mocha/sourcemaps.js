var assert = require("assert");
var readFileSync = require("fs").readFileSync;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var UglifyJS = require("../..");

function read(path) {
    return readFileSync(path, "utf8");
}

function source_map(code) {
    return JSON.parse(UglifyJS.minify(code, {
        compress: false,
        mangle: false,
        sourceMap: true,
    }).map);
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

function prepare_map(sourceMap) {
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
    var result = UglifyJS.minify(code, {
        sourceMap: {
            content: sourceMap,
            includeSources: true,
        }
    });
    if (result.error) throw result.error;
    return new SourceMapConsumer(result.map);
}

describe("sourcemaps", function() {
    it("Should give correct version", function() {
        var map = source_map("var x = 1 + 1;");
        assert.strictEqual(map.version, 3);
        assert.deepEqual(map.names, [ "x" ]);
    });
    it("Should give correct names", function() {
        var map = source_map([
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
    it("Should mark array/object literals", function() {
        var result = UglifyJS.minify([
            "var obj = {};",
            "obj.wat([]);",
        ].join("\n"), {
            sourceMap: true,
            toplevel: true,
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, "({}).wat([]);");
        assert.strictEqual(result.map, '{"version":3,"sources":["0"],"names":["wat"],"mappings":"CAAU,IACNA,IAAI"}');
    });
    it("Should mark class literals", function() {
        var result = UglifyJS.minify([
            "class bar {};",
            "var obj = class {};",
            "obj.wat(bar);",
        ].join("\n"), {
            sourceMap: true,
            toplevel: true,
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, "(class{}).wat(class{});");
        assert.strictEqual(result.map, '{"version":3,"sources":["0"],"names":["wat"],"mappings":"CACU,SACNA,IAFJ"}');
    });
    it("Should give correct sourceRoot", function() {
        var code = "console.log(42);";
        var result = UglifyJS.minify(code, {
            sourceMap: {
                root: "//foo.bar/",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, code);
        assert.strictEqual(result.map, '{"version":3,"sources":["0"],"names":["console","log"],"mappings":"AAAAA,QAAQC,IAAI","sourceRoot":"//foo.bar/"}');
    });

    describe("inSourceMap", function() {
        it("Should read the given string filename correctly when sourceMapIncludeSources is enabled", function() {
            var result = UglifyJS.minify(read("./test/input/issue-1236/simple.js"), {
                sourceMap: {
                    content: read("./test/input/issue-1236/simple.js.map"),
                    filename: "simple.min.js",
                    includeSources: true
                }
            });
            if (result.error) throw result.error;
            var map = JSON.parse(result.map);
            assert.equal(map.file, "simple.min.js");
            assert.equal(map.sourcesContent.length, 1);
            assert.equal(map.sourcesContent[0], 'let foo = x => "foo " + x;\nconsole.log(foo("bar"));');
        });
        it("Should process inline source map", function() {
            var result = UglifyJS.minify(read("./test/input/issue-520/input.js"), {
                compress: { toplevel: true },
                sourceMap: {
                    content: "inline",
                    includeSources: true,
                    url: "inline"
                }
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code + "\n", readFileSync("test/input/issue-520/output.js", "utf8"));
        });
        it("Should warn for missing inline source map", function() {
            var warn_function = UglifyJS.AST_Node.warn_function;
            var warnings = [];
            UglifyJS.AST_Node.warn_function = function(txt) {
                warnings.push(txt);
            };
            try {
                var result = UglifyJS.minify(read("./test/input/issue-1323/sample.js"), {
                    mangle: false,
                    sourceMap: {
                        content: "inline"
                    }
                });
                assert.strictEqual(result.code, "var bar=function(){return function(bar){return bar}}();");
                assert.strictEqual(warnings.length, 1);
                assert.strictEqual(warnings[0], "inline source map not found");
            } finally {
                UglifyJS.AST_Node.warn_function = warn_function;
            }
        });
    });

    describe("sourceMapInline", function() {
        it("Should append source map to output js when sourceMapInline is enabled", function() {
            var result = UglifyJS.minify('var a = function(foo) { return foo; };', {
                sourceMap: {
                    url: "inline"
                }
            });
            if (result.error) throw result.error;
            var code = result.code;
            assert.strictEqual(code, "var a=function(n){return n};\n" +
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAiXSwibmFtZXMiOlsiYSIsImZvbyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsRUFBSSxTQUFTQyxHQUFPLE9BQU9BIn0=");
        });
        it("Should not append source map to output js when sourceMapInline is not enabled", function() {
            var result = UglifyJS.minify('var a = function(foo) { return foo; };');
            if (result.error) throw result.error;
            var code = result.code;
            assert.strictEqual(code, "var a=function(n){return n};");
        });
        it("Should work with max_line_len", function() {
            var result = UglifyJS.minify(read("./test/input/issue-505/input.js"), {
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
            assert.strictEqual(result.code, read("./test/input/issue-505/output.js"));
        });
        it("Should work with unicode characters", function() {
            var code = [
                "var tëst = '→unicøde←';",
                "alert(tëst);",
            ].join("\n");
            var result = UglifyJS.minify(code, {
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
            map = JSON.parse(UglifyJS.to_ascii(encoded).toString());
            assert.strictEqual(map.sourcesContent.length, 1);
            assert.strictEqual(map.sourcesContent[0], code);
            result = UglifyJS.minify(result.code, {
                sourceMap: {
                    content: "inline",
                    includeSources: true,
                }
            });
            if (result.error) throw result.error;
            map = JSON.parse(result.map);
            assert.strictEqual(map.names.length, 2);
            assert.strictEqual(map.names[0], "tëst");
            assert.strictEqual(map.names[1], "alert");
        });
    });

    describe("input sourcemaps", function() {
        it("Should copy over original sourcesContent", function() {
            var orig = get_map();
            var map = prepare_map(orig);
            assert.equal(map.sourceContentFor("index.js"), orig.sourcesContent[0]);
        });
        it("Should copy sourcesContent if sources are relative", function() {
            var relativeMap = get_map();
            relativeMap.sources = ['./index.js'];
            var map = prepare_map(relativeMap);
            assert.notEqual(map.sourcesContent, null);
            assert.equal(map.sourcesContent.length, 1);
            assert.equal(map.sourceContentFor("index.js"), relativeMap.sourcesContent[0]);
        });
        it("Should not have invalid mappings from inputSourceMap", function() {
            var map = prepare_map(get_map());
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
