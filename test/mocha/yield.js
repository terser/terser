import assert from "assert";

import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";

describe("Yield", function() {
    it("Should not delete statements after yield", async function() {
        var js = 'function *foo(bar) { yield 1; yield 2; return 3; }';
        var result = await minify(js);
        assert.strictEqual(result.code, 'function*foo(e){return yield 1,yield 2,3}');
    });

    it("Should not allow yield* followed by a semicolon in generators", async function() {
        var js = "function* test() {yield*\n;}";
        var expect = function(e) {
            return e.message === "Unexpected token: punc (;)";
        }
        assert.throws(() => parse(js), expect);
    });

    it("Should not allow yield with next token star on next line", async function() {
        var js = "function* test() {yield\n*123;}";
        var test = function() {
            parse(js);
        }
        var expect = function(e) {
            return e.message === "Unexpected token: operator (*)";
        }
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

    var identifiers = [
        // Fail in as_symbol
        'import yield from "bar";',
        'yield = 123;',
        'yield: "123";',
        'for(;;){break yield;}',
        'for(;;){continue yield;}',
        'function yield(){}',
        'try { new Error("")} catch (yield) {}',
        'var yield = "foo";',
        'class yield {}',
        // Fail in as_property_name
        'var foo = {yield};',
    ];

    it("Should not allow yield to be used as symbol, identifier or shorthand property outside generators in strict mode", async function() {
        function fail(e) {
            return /^Unexpected yield identifier (?:as parameter )?inside strict mode/.test(e.message);
        }

        function test(input) {
            return function() {
                parse(input);
            };
        }

        identifiers.concat([
            // Fail in as_symbol
            "function foo(...yield){}",
            // Fail in maybe_assign
            'var foo = yield;',
            'var foo = bar = yield',
        ]).map(function(code) {
            return '"use strict"; ' + code;
        }).forEach(function(code) {
            assert.throws(test(code), fail, code);
        });
    });

    it("Should not allow yield to be used as symbol, identifier or shorthand property inside generators", async function() {
        function fail(e) {
            return [
                "Unexpected token: operator (=)",
                "Yield cannot be used as identifier inside generators",
            ].includes(e.message);
        }

        function test(input) {
            return function() {
                parse(input);
            };
        }

        identifiers.map(function(code) {
            return "function* f() { " + code + " }";
        }).concat([
            // Fail in as_symbol
            "function* f(yield) {}",
        ]).forEach(function(code) {
            assert.throws(test(code), fail, code);
        });
    });

    it("Should allow yield to be used as class/object property name", async function() {
        var input = [
            '"use strict";',
            "({yield:42});",
            "({yield(){}});",
            "(class{yield(){}});",
            "class C{yield(){}}",
        ].join("");
        assert.strictEqual((await minify(input, { compress: false })).code, input);
    });
});
