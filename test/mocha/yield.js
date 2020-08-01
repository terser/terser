import assert from "assert";

import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";

describe("Yield", function() {
    it("Should not delete statements after yield", async function() {
        var js = "function *foo(bar) { yield 1; yield 2; return 3; }";
        var result = await minify(js);
        assert.strictEqual(result.code, "function*foo(e){return yield 1,yield 2,3}");
    });

    it("Should not allow yield* followed by a semicolon in generators", async function() {
        var js = "function* test() {yield*\n;}";
        var expect = function(e) {
            return e.message === "Unexpected token: punc (;)";
        };
        assert.throws(() => parse(js), expect);
    });

    it("Should not allow yield with next token star on next line", async function() {
        var js = "function* test() {yield\n*123;}";
        var test = function() {
            parse(js);
        };
        var expect = function(e) {
            return e.message === "Unexpected token: operator (*)";
        };
        assert.throws(test, expect);
    });

    it("Should be able to compress its expression", async function() {
        assert.strictEqual(
            (await minify("function *f() { yield 3-4; }", {compress: true})).code,
            "function*f(){yield-1}"
        );
    });

    it("Should keep undefined after yield without compression if found in ast", async function() {
        assert.strictEqual(
            (await minify("function *f() { yield undefined; yield; yield* undefined; yield void 0}", {compress: false})).code,
            "function*f(){yield undefined;yield;yield*undefined;yield void 0}"
        );
    });

    it("Should be able to drop undefined after yield if necessary with compression", async function() {
        assert.strictEqual(
            (await minify("function *f() { yield undefined; yield; yield* undefined; yield void 0}", {compress: true})).code,
            "function*f(){yield,yield,yield*void 0,yield}"
        );
    });
});
