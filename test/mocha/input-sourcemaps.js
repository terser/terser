import assert from "assert";
import { minify } from "../../main.js";
import source_map from "source-map"

const { SourceMapConsumer, SourceMapGenerator } = source_map

describe("input sourcemaps", function() {
    var transpilemap, map;

    function getMap() {
      return {
          "version": 3,
          "sources": ["index.js"],
          "names": [],
          "mappings": ";;AAAA,IAAI,MAAM,SAAN,GAAM;AAAA,SAAK,SAAS,CAAd;AAAA,CAAV;AACA,QAAQ,GAAR,CAAY,IAAI,KAAJ,CAAZ",
          "file": "bundle.js",
          "sourcesContent": ["let foo = x => \"foo \" + x;\nconsole.log(foo(\"bar\"));"]
      };
    }

    async function prepareMap(sourceMap) {
        var transpiled = '"use strict";\n\n' +
            'var foo = function foo(x) {\n  return "foo " + x;\n};\n' +
            'console.log(foo("bar"));\n\n' +
            '//# sourceMappingURL=bundle.js.map';

        transpilemap = sourceMap || getMap();

        var result = await minify(transpiled, {
            sourceMap: {
                content: transpilemap
            }
        });

        map = await new SourceMapConsumer(result.map);
    }

    beforeEach(async function () {
      await prepareMap();
    });

    it("Should copy over original sourcesContent", async function() {
        assert.equal(map.sourceContentFor("index.js"), transpilemap.sourcesContent[0]);
    });

    it("Should copy sourcesContent if sources are relative", async function() {
        var relativeMap = getMap();
        relativeMap.sources = ['./index.js'];

        await prepareMap(relativeMap);
        assert.notEqual(map.sourcesContent, null);
        assert.equal(map.sourcesContent.length, 1);
        assert.equal(map.sourceContentFor("index.js"), transpilemap.sourcesContent[0]);
    });

    it("Final sourcemap should not have invalid mappings from inputSourceMap (issue #882)", async function() {
        // The original source has only 2 lines, check that mappings don't have more lines

        var msg = "Mapping should not have higher line number than the original file had";
        map.eachMapping(function(mapping) {
            assert.ok(mapping.originalLine <= 2, msg)
        });

        map.allGeneratedPositionsFor({source: "index.js", line: 1, column: 1}).forEach(function(pos) {
            assert.ok(pos.line <= 2, msg);
        })
    });

    it("Should preserve unmapped segments in output source map", async function() {
        var generator = new SourceMapGenerator();

        generator.addMapping({
            source: "source.ts",
            generated: {line: 1, column: 0},
            original: {line: 1, column: 0},
        });
        generator.addMapping({
            source: null,
            generated: {line: 1, column: 37},
            original: null,
        });

        generator.addMapping({
            source: "source.ts",
            generated: {line: 1, column: 50},
            original: {line: 2, column: 0},
        });

        generator.setSourceContent("source.ts",
            `function say(msg) {console.log(msg)};say('hello');\nprocess.exit(1);`)

        // Everything except the "say('hello');" part is mapped to "source.ts". The "say"
        // function call is not mapped to any original source location. e.g. this can
        // happen when a code transformer inserts generated code in between existing code.
        var inputFile = "function say(msg) {console.log(msg)};say('hello');process.exit(1);";
        var result = await minify(inputFile, {
            sourceMap: {
                content: JSON.parse(generator.toString()),
                url: 'inline'
            }
        });

        var transformedMap = await new SourceMapConsumer(result.map);
        var hasMappedSource = true;

        for (let i = 0; i < result.code.length; i++) {
            var info = transformedMap.originalPositionFor({line: 1, column: i});
            hasMappedSource = hasMappedSource && !!info.source;
        }

        assert.equal(hasMappedSource, false, "Expected transformed source map to preserve the " +
            "mapping without original source location");

        assert.doesNotThrow(() => SourceMapGenerator.fromSourceMap(transformedMap));
    });
});
