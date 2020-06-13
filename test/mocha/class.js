import assert from "assert";
import { parse } from "../../lib/parse.js";
import { minify } from "../../main.js";

describe("Class", function() {
    it("Should not accept spread on non-last parameters in methods", async function() {
        var tests = [
            "class foo { bar(...a, b) { return a.join(b) } }",
            "class foo { bar(a, b, ...c, d) { return c.join(a + b) + d } }",
            "class foo { *bar(...a, b) { return a.join(b) } }",
            "class foo { *bar(a, b, ...c, d) { return c.join(a + b) + d } }"
        ];
        var test = function(code) {
            return function() {
                parse(code);
            };
        };
        var error = function(e) {
            return /^Unexpected token: /.test(e.message);
        };

        for (var i = 0; i < tests.length; i++) {
            assert.throws(test(tests[i]), error);
        }
    });

    it("Should return the correct token for class methods", async function() {
        var tests = [
            {
                code: "class foo{static test(){}}",
                token_value_start: "static",
                token_value_end: "}"
            },
            {
                code: "class bar{*procedural(){}}",
                token_value_start: "*",
                token_value_end: "}"
            },
            {
                code: "class foobar{aMethod(){}}",
                token_value_start: "aMethod",
                token_value_end: "}"
            },
            {
                code: "class foobaz{get something(){}}",
                token_value_start: "get",
                token_value_end: "}"
            }
        ];

        for (var i = 0; i < tests.length; i++) {
            var ast = parse(tests[i].code);
            assert.strictEqual(ast.body[0].properties[0].start.value, tests[i].token_value_start);
            assert.strictEqual(ast.body[0].properties[0].end.value, tests[i].token_value_end);
        }
    });

    it("should work properly with class properties", async () => {
        const input = `class A {
            static a
            a;
            static fil
            = 1
            another = "";
        }`;

        const result = (await minify(input)).code;

        assert.strictEqual(result, 'class A{static a;a;static fil=1;another=""}');
    });
});
