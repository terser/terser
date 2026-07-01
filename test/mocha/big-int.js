import assert from "assert";
import { minify } from "../../main.js";

describe("BigInt", function() {
    it("Should not spend excessive time folding a large BigInt exponentiation", async function() {
        // A tiny input must not make minify() compute and serialize an
        // astronomically large BigInt. See issue #1703 (before the guard this
        // took ~10s; the expression is left unfolded, so it is a no-op too).
        var start = Date.now();
        var result = await minify("if (999999937n ** 3999999n) console.log(1);", {
            compress: true,
            mangle: false,
        });
        var elapsed = Date.now() - start;
        assert.strictEqual(/\*\*/.test(result.code), true, result.code);
        assert.strictEqual(elapsed < 5000, true, "minify took " + elapsed + "ms");
    });

    it("Should not throw folding a BigInt with a negative exponent", async function() {
        // `x ** <negative>` throws a RangeError at runtime, so it must be left
        // untouched instead of being evaluated and crashing the compressor.
        for (var input of [
            "x = 2n ** -3n;",
            "x = 0n ** -1n;",
            "x = (5n) ** (-2n);",
        ]) {
            var result = await minify(input, { compress: true, mangle: false });
            assert.strictEqual(/\*\*/.test(result.code), true, result.code);
        }
    });
});
