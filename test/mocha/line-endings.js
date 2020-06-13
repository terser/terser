import assert from "assert";
import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";

describe("line-endings", function() {
    var options = {
        compress: false,
        mangle: false,
        output: {
            beautify: false,
            comments: /^!/,
        }
    };
    var expected_code = '/*!one\n2\n3*/\nfunction f(x){if(x)return 3}';

    it("Should parse LF line endings", async function() {
        var js = '/*!one\n2\n3*///comment\nfunction f(x) {\n if (x)\n//comment\n  return 3;\n}\n';
        var result = await minify(js, options);
        assert.strictEqual(result.code, expected_code);
    });

    it("Should parse CR/LF line endings", async function() {
        var js = '/*!one\r\n2\r\n3*///comment\r\nfunction f(x) {\r\n if (x)\r\n//comment\r\n  return 3;\r\n}\r\n';
        var result = await minify(js, options);
        assert.strictEqual(result.code, expected_code);
    });

    it("Should parse CR line endings", async function() {
        var js = '/*!one\r2\r3*///comment\rfunction f(x) {\r if (x)\r//comment\r  return 3;\r}\r';
        var result = await minify(js, options);
        assert.strictEqual(result.code, expected_code);
    });

    it("Should not allow line terminators in regexp", async function() {
        var inputs = [
            "/\n/",
            "/\r/",
            "/\u2028/",
            "/\u2029/",
            "/\\\n/",
            "/\\\r/",
            "/\\\u2028/",
            "/\\\u2029/",
            "/someRandomTextLike[]()*AndThen\n/"
        ]
        var test = function(input) {
            return function() {
                parse(input);
            };
        }
        var fail = function(e) {
            return e.message === "Unexpected line terminator";
        }
        for (var i = 0; i < inputs.length; i++) {
            assert.throws(test(inputs[i]), fail);
        }
    });
});
