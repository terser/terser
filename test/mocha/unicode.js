import assert from "assert";
import { parse } from "../../lib/parse.js";
import { minify } from "../../main.js";
import { for_each_async } from "./utils.js";

describe("Unicode", function() {
    it("Should throw error if escaped first identifier char is not part of ID_start", async function() {
        var tests = [
            'var \\u{0} = "foo";',
            'var \\u{10ffff} = "bar";',
            'var \\u000a = "what\'s up";',
             // Valid ID_Start, but using up 2 escaped characters and not fitting in IdentifierStart
            'var \\ud800\\udc00 = "Hello";',
            'var \\udbff\\udfff = "Unicode";', // Same as previous test
            'var \\ud800\udc01 = "Weird unicode";', // Same as above, but mixed escaped with unicode chars
        ];

        var fail = function(e) {
            return e.message === "First identifier char is an invalid identifier char";
        }

        for (var i = 0; i < tests.length; i++) {
            assert.throws(() => parse(tests[i]), fail);
        }
    });

    it("Should throw error if escaped non-first identifier char is not part of ID_start", async function() {
        var tests = [
            'var a\\u{0} = "foo";',
            'var a\\u{10ffff} = "bar";',
            'var z\\u000a = "what\'s up";'
        ];

        var fail = function(e) {
            return e.message === "Invalid escaped identifier char";
        }

        for (var i = 0; i < tests.length; i++) {
            assert.throws(() => parse(tests[i]), fail);
        }
    });

    it("Should throw error if identifier is a keyword with a escape sequences", async function() {
        var tests = [
            'var \\u0069\\u006e = "foo"',        // in
            'var \\u0076\\u0061\\u0072 = "bar"', // var
            'var \\u{66}\\u{6f}\\u{72} = "baz"', // for
            'var \\u0069\\u{66} = "foobar"',     // if
            'var \\u{73}uper'                    // super
        ];

        var fail = function(e) {
            return e.message === "Escaped characters are not allowed in keywords";
        }

        for (var i = 0; i < tests.length; i++) {
            assert.throws(() => parse(tests[i]), fail);
        }
    });

    it("Should read strings containing surrogates correctly", async function() {
        var tests = [
            ['var a = "\ud800\udc00";', 'var a="\\u{10000}";'],
            ['var b = "\udbff\udfff";', 'var b="\\u{10ffff}";']
        ];

        for (var i = 0; i < tests.length; i++) {
            assert.strictEqual((await minify(tests[i][0], {
                output: { ascii_only: true, ecma: 2015 }
            })).code, tests[i][1]);
        }
    });

    it("Should parse raw characters correctly", async function() {
        var ast = parse('console.log("\\udbff");');
        assert.strictEqual(ast.print_to_string(), 'console.log("\\udbff");');
        ast = parse(ast.print_to_string());
        assert.strictEqual(ast.print_to_string(), 'console.log("\\udbff");');
    });

    it("Should not strip quotes for object property name when there is unallowed character", async function() {
        await for_each_async([undefined, 2022], async function(ecma) {
            var code = 'console.log({"hello・world":123});';
            var result = await minify(code, { ecma });
            assert.strictEqual(result.code, 'console.log({"hello・world":123});');
        });
    });

    describe("narrower ID_Start and ID_Continue (older unicode versions)", () => {
        it("variable names", async function() {
            var code = '\u02C6;';
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, '\u02C6;');

            var code = '\\u02C6;'; // slash-escaped varname
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, '\u02C6;');
        });
        it("object properties", async function() {
            var code = 'console.log({ \u02C6: 1 });';
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, 'console.log({\u02C6:1});');

            var code = 'console.log({ \\u02C6: 1 });'; // slash-escaped prop name
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, 'console.log({\u02C6:1});');
        });
    });

    describe("broader ID_Start and ID_Continue (newer unicode versions)", () => {
        it("variable names", async function() {
            var code = '\u{170e3};';
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, '\\u{170e3};');

            var code = '\\u{170e3};'; // slash-escaped varname from a new unicode version
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, '\\u{170e3};');

            // BASE CASE
            var code = '\\u{41};'; // slash-escaped A
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, 'A;');
        });

        it("object properties", async function() {
            var code = 'leak({ \u{170e3}: 1 });';
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, 'leak({"\u{170e3}":1});');

            var code = 'leak({ \\u{170e3}: 1 });'; // slash-escaped prop name from a new unicode version
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, 'leak({"\u{170e3}":1});');

            // BASE CASE
            var code = 'leak({ "\\u{41}": 1 });'; // slash-escaped A
            var result = await minify(code, { ecma: 2024 });
            assert.strictEqual(result.code, 'leak({A:1});');
        });
    });

    it("Should not unescape unpaired surrogates", async function() {
        this.timeout(20000);
        var code = [];
        for (var i = 0; i <= 0x1001; i++) {
            code.push("\\u{" + i.toString(16) + "}");
        }
        for (var i = 0x19000; i <= 0x20001; i++) {
            code.push("\\u{" + i.toString(16) + "}");
        }
        code = '"' + code.join() + '"';
        await for_each_async([true, false], async function(ascii_only) {
            await for_each_async([5, 2015], async function(ecma) {
                var result = await minify(code, {
                    compress: false,
                    mangle: false,
                    output: {
                        ascii_only: ascii_only
                    },
                    ecma: ecma
                });
                if (result.error) throw result.error;
                if (ecma >= 2015) assert.ok(code.length > result.code.length);
                assert.strictEqual(eval(code), eval(result.code));
            });
        });
    });
});
