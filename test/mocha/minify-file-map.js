import assert from "assert";
import { minify } from "../../main.js";

describe("Input file as map", function() {
    it("Should accept object", async function() {
        var jsMap = {
            '/scripts/foo.js': 'var foo = {"x": 1, y: 2, \'z\': 3};'
        };
        var result = await minify(jsMap, {sourceMap: true});

        var map = JSON.parse(result.map);
        assert.strictEqual(result.code, 'var foo={x:1,y:2,z:3};');
        assert.deepEqual(map.sources, ['/scripts/foo.js']);
        assert.strictEqual(map.file, undefined);

        result = await minify(jsMap);
        assert.strictEqual(result.map, undefined);

        result = await minify(jsMap, {sourceMap: {filename: 'out.js'}});
        map = JSON.parse(result.map);
        assert.strictEqual(map.file, 'out.js');
    });

    it("Should accept array of strings", async function() {
        var jsSeq = [
            'var foo = {"x": 1, y: 2, \'z\': 3};',
            'var bar = 15;'
        ];
        var result = await minify(jsSeq, {sourceMap: true});

        var map = JSON.parse(result.map);
        assert.strictEqual(result.code, 'var foo={x:1,y:2,z:3},bar=15;');
        assert.deepEqual(map.sources, ['0', '1']);
    });

    it("Should correctly include source", async function() {
        var jsMap = {
            '/scripts/foo.js': 'var foo = {"x": 1, y: 2, \'z\': 3};'
        };
        var result = await minify(jsMap, {sourceMap: {includeSources: true}});

        var map = JSON.parse(result.map);
        assert.strictEqual(result.code, 'var foo={x:1,y:2,z:3};');
        assert.deepEqual(map.sourcesContent, ['var foo = {"x": 1, y: 2, \'z\': 3};']);
    });
});
