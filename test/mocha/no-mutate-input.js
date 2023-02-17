import assert from "assert";
import { minify } from "../../main.js";

describe("no-mutate-input", function() {

    it("does not modify the options object", async function() {
        const config = {
            format: {},
            sourceMap: true,
        };

        await minify('"foo";', config);

        assert.deepEqual(config, {
            format: {},
            sourceMap: true,
        });
    });

    it("does not clobber source maps with a subsequent minification", async function() {
        const config = {
            format: {},
            sourceMap: true,
        };

        const fooResult = await minify('"foo";', config);
        const barResult = await minify('module.exports = "bar";', config);

        const fooMap = fooResult.map;
        const barMap = barResult.map;

        assert.notEqual(barMap, fooMap);
    });
});
