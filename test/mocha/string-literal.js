import assert from "assert";
import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";

describe("String literals", function() {
    it("Should throw syntax error if a string literal contains a newline", async function() {
        var inputs = [
            "'\n'",
            "'\r'",
            '"\r\n"'
        ];

        var error = function(e) {
            return e.message === "Unterminated string constant";
        };

        for (var input of inputs) {
            assert.throws(() => parse(input), error);
        }
    });

    it("Should not throw syntax error if a string has a line continuation", async function() {
        var output = parse('var a = "a\\\nb";').print_to_string();
        assert.equal(output, 'var a="ab";');
    });

    it("Should throw error in strict mode if string contains escaped octalIntegerLiteral", async function() {
        var inputs = [
            '"use strict";\n"\\76";',
            '"use strict";\nvar foo = "\\76";',
            '"use strict";\n"\\1";',
            '"use strict";\n"\\07";',
            '"use strict";\n"\\011"'
        ];

        var error = function(e) {
            return e.message === "Legacy octal escape sequences are not allowed in strict mode";
        }

        for (var input of inputs) {
            assert.throws(() => parse(input), error);
        }
    });

    it("Should not throw error outside strict mode if string contains escaped octalIntegerLiteral", async function() {
        var tests = [
            ['"\\76";', ';">";'],
            ['"\\0"', '"\\0";'],
            ['"\\08"', '"\\x008";'],
            ['"\\008"', '"\\x008";'],
            ['"\\0008"', '"\\x008";'],
            ['"use strict" === "use strict";\n"\\76";', '"use strict"==="use strict";">";'],
            ['"use\\\n strict";\n"\\07";', ';"use strict";"\u0007";']
        ];

        for (var [input, output] of tests) {
            assert.equal(parse(input).print_to_string(), output);
        }
    });

    it("Should not throw error when digit is 8 or 9", async function() {
        assert.equal(parse('"use strict";"\\08";').print_to_string(), '"use strict";"\\x008";');
        assert.equal(parse('"use strict";"\\09";').print_to_string(), '"use strict";"\\x009";');
    });

    it("Should not unescape unpaired surrogates", async function() {
        var code = [], i = 0;
        for (; i <= 0x000F; i++) code.push("\\u000" + i.toString(16));
        for (; i <= 0x00FF; i++) code.push("\\u00" + i.toString(16));
        for (; i <= 0x0FFF; i++) code.push("\\u0" + i.toString(16));
        for (; i <= 0xFFFF; i++) code.push("\\u" + i.toString(16));
        code = '"' + code.join() + '"';
        var normal = await minify(code, {
            compress: false,
            mangle: false,
            output: {
                ascii_only: false
            }
        });
        if (normal.error) throw normal.error;
        assert.ok(code.length > normal.code.length);
        assert.strictEqual(eval(code), eval(normal.code));
        var ascii = await minify(code, {
            compress: false,
            mangle: false,
            output: {
                ascii_only: true
            }
        });
        if (ascii.error) throw ascii.error;
        assert.ok(code.length > ascii.code.length);
        assert.strictEqual(eval(code), eval(ascii.code));
    });
});
