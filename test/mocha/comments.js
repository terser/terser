import assert from "assert";
import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";
import { OutputStream } from "../../lib/output.js";
import { for_each_async } from "./utils.js"

describe("comments", function() {
    it("Should recognize eol of single line comments", async function() {
        var tests = [
            "//Some comment 1\n>",
            "//Some comment 2\r>",
            "//Some comment 3\r\n>",
            "//Some comment 4\u2028>",
            "//Some comment 5\u2029>"
        ];

        var fail = function(e) {
            return e.message === "Unexpected token: operator (>)"
                && e.line === 2
                && e.col === 0;
        };

        for (var i = 0; i < tests.length; i++) {
            assert.throws(() => parse(tests[i]), fail, tests[i]);
        }
    });

    it("Should update the position of a multiline comment correctly", async function() {
        var tests = [
            "/*Some comment 1\n\n\n*/\n>\n\n\n\n\n\n",
            "/*Some comment 2\r\n\r\n\r\n*/\r\n>\n\n\n\n\n\n",
            "/*Some comment 3\r\r\r*/\r>\n\n\n\n\n\n",
            "/*Some comment 4\u2028\u2028\u2028*/\u2028>\n\n\n\n\n\n",
            "/*Some comment 5\u2029\u2029\u2029*/\u2029>\n\n\n\n\n\n"
        ];

        var fail = function(e) {
            return e.message === "Unexpected token: operator (>)"
                && e.line === 5
                && e.col === 0;
        }

        for (var i = 0; i < tests.length; i++) {
            assert.throws(() => parse(tests[i]), fail, tests[i]);
        }
    });

    it("Should handle comment within return correctly", async function() {
        var result = await minify([
            "function unequal(x, y) {",
            "    return (",
            "        // Either one",
            "        x < y",
            "        ||",
            "        y < x",
            "    );",
            "}",
        ].join("\n"), {
            compress: false,
            mangle: false,
            output: {
                beautify: true,
                comments: "all",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, [
            "function unequal(x, y) {",
            "    // Either one",
            "    return x < y || y < x;",
            "}",
        ].join("\n"));
    });

    it("Should handle comment folded into return correctly", async function() {
        var result = await minify([
            "function f() {",
            "    /* boo */ x();",
            "    return y();",
            "}",
        ].join("\n"), {
            mangle: false,
            output: {
                beautify: true,
                comments: "all",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, [
            "function f() {",
            "    /* boo */",
            "    return x(), y();",
            "}",
        ].join("\n"));
    });

    it("Should not drop comments after first OutputStream", async function() {
        var code = "/* boo */\nx();";
        var ast = parse(code);
        var out1 = OutputStream({
            beautify: true,
            comments: "all",
        });
        ast.print(out1);
        var out2 = OutputStream({
            beautify: true,
            comments: "all",
        });
        ast.print(out2);
        assert.strictEqual(out1.get(), code);
        assert.strictEqual(out2.get(), out1.get());
    });

    it("Should retain trailing comments", async function() {
        var code = [
            "if (foo /* lost comment */ && bar /* lost comment */) {",
            "    // this one is kept",
            "    {/* lost comment */}",
            "    !function() {",
            "        // lost comment",
            "    }();",
            "    function baz() {/* lost comment */}",
            "    // lost comment",
            "}",
            "// comments right before EOF are lost as well",
        ].join("\n");
        var result = await minify(code, {
            compress: false,
            mangle: false,
            output: {
                beautify: true,
                comments: "all",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, code);
    });

    it("Should retain comments within braces", async function() {
        var code = [
            "{/* foo */}",
            "a({/* foo */});",
            "while (a) {/* foo */}",
            "switch (a) {/* foo */}",
            "if (a) {/* foo */} else {/* bar */}",
        ].join("\n\n");
        var result = await minify(code, {
            compress: false,
            mangle: false,
            output: {
                beautify: true,
                comments: "all",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, code);
    });

    it("Should correctly preserve new lines around comments", async function() {
        await for_each_async([
            [
                "// foo",
                "// bar",
                "x();",
            ].join("\n"),
            [
                "// foo",
                "/* bar */",
                "x();",
            ].join("\n"),
            [
                "// foo",
                "/* bar */ x();",
            ].join("\n"),
            [
                "/* foo */",
                "// bar",
                "x();",
            ].join("\n"),
            [
                "/* foo */ // bar",
                "x();",
            ].join("\n"),
            [
                "/* foo */",
                "/* bar */",
                "x();",
            ].join("\n"),
            [
                "/* foo */",
                "/* bar */ x();",
            ].join("\n"),
            [
                "/* foo */ /* bar */",
                "x();",
            ].join("\n"),
            "/* foo */ /* bar */ x();",
        ], async function(code) {
            var result = await minify(code, {
                compress: false,
                mangle: false,
                output: {
                    beautify: true,
                    comments: "all",
                },
            });
            if (result.error) throw result.error;
            assert.strictEqual(result.code, code);
        });
    });

    it("Should preserve new line before comment without beautify", async function() {
        var code = [
            "function f(){",
            "/* foo */bar()}",
        ].join("\n");
        var result = await minify(code, {
            compress: false,
            mangle: false,
            output: {
                comments: "all",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, code);
    });

    it("Should preserve comments around IIFE", async function() {
        var result = await minify("/*a*/(/*b*/function(){/*c*/}/*d*/)/*e*/();", {
            compress: false,
            mangle: false,
            output: {
                comments: "all",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, "/*a*/ /*b*/(function(){/*c*/}/*d*/ /*e*/)();");
    });

    it("Should output line comments after statements", async function() {
        var result = await minify([
            "x()//foo",
            "{y()//bar",
            "}",
        ].join("\n"), {
            compress: false,
            mangle: false,
            output: {
                comments: "all",
            },
        });
        if (result.error) throw result.error;
        assert.strictEqual(result.code, [
            "x();//foo",
            "{y();//bar",
            "}",
        ].join("\n"));
    });

    describe("comment before constant", function() {
        var js = "function f() { /*c1*/ var /*c2*/ foo = /*c3*/ false; return foo; }";

        it("Should test comment before constant is retained and output after mangle.", async function() {
            var result = await minify(js, {
                compress: { collapse_vars: false, reduce_vars: false },
                output: { comments: true },
            });
            assert.strictEqual(result.code, "function f(){/*c1*/var/*c2*/n=/*c3*/!1;return n}");
        });

        it("Should test code works when comments disabled.", async function() {
            var result = await minify(js, {
                compress: { collapse_vars: false, reduce_vars: false },
                output: { comments: false },
            });
            assert.strictEqual(result.code, "function f(){var n=!1;return n}");
        });
    });

    describe("comment filters", function() {
        it("Should be able to filter comments by passing regexp", async function() {
            var ast = parse("/*!test1*/\n/*test2*/\n//!test3\n//test4\n<!--test5\n<!--!test6\n-->test7\n-->!test8");
            assert.strictEqual(ast.print_to_string({comments: /^!/}), "/*!test1*/\n//!test3\n//!test6\n//!test8\n");
        });

        it("Should be able to filter comments with the 'all' option", async function() {
            var ast = parse("/*!test1*/\n/*test2*/\n//!test3\n//test4\n<!--test5\n<!--!test6\n-->test7\n-->!test8");
            assert.strictEqual(ast.print_to_string({comments: "all"}), "/*!test1*/\n/*test2*/\n//!test3\n//test4\n//test5\n//!test6\n//test7\n//!test8\n");
        });

        it("Should be able to filter commments with the 'some' option", async function() {
            var ast = parse("// foo\n/*@preserve*/\n// bar\n/*@license*/\n//@lic two slashes\n/*@cc_on something*/");
            assert.strictEqual(ast.print_to_string({comments: "some"}), "/*@preserve*/\n/*@license*/\n//@lic two slashes\n/*@cc_on something*/");
        });

        it("Should be able to filter comments by passing a function", async function() {
            var ast = parse("/*TEST 123*/\n//An other comment\n//8 chars.");
            var f = function(node, comment) {
                return comment.value.length === 8;
            };

            assert.strictEqual(ast.print_to_string({comments: f}), "/*TEST 123*/\n//8 chars.\n");
        });

        it("Should be able to filter comments by passing regex in string format", async function() {
            var ast = parse("/*!test1*/\n/*test2*/\n//!test3\n//test4\n<!--test5\n<!--!test6\n-->test7\n-->!test8");
            assert.strictEqual(ast.print_to_string({comments: "/^!/"}), "/*!test1*/\n//!test3\n//!test6\n//!test8\n");
        });

        it("Should be able to get the comment and comment type when using a function", async function() {
            var ast = parse("/*!test1*/\n/*test2*/\n//!test3\n//test4\n<!--test5\n<!--!test6\n-->test7\n-->!test8");
            var f = function(node, comment) {
                return comment.type == "comment1" || comment.type == "comment3";
            };

            assert.strictEqual(ast.print_to_string({comments: f}), "//!test3\n//test4\n//test5\n//!test6\n");
        });

        it("Should be able to filter comments by passing a boolean", async function() {
            var ast = parse("/*!test1*/\n/*test2*/\n//!test3\n//test4\n<!--test5\n<!--!test6\n-->test7\n-->!test8");

            assert.strictEqual(ast.print_to_string({comments: true}), "/*!test1*/\n/*test2*/\n//!test3\n//test4\n//test5\n//!test6\n//test7\n//!test8\n");
            assert.strictEqual(ast.print_to_string({comments: false}), "");
        });

        it("Should never be able to filter comment5 (shebangs)", async function() {
            var ast = parse("#!Random comment\n//test1\n/*test2*/");
            var f = function(node, comment) {
                assert.strictEqual(comment.type === "comment5", false);

                return true;
            };

            assert.strictEqual(ast.print_to_string({comments: f}), "#!Random comment\n//test1\n/*test2*/");
        });

        it("Should never be able to filter comment5 when using 'some' as filter", async function() {
            var ast = parse("#!foo\n//foo\n/*@preserve*/\n/* please hide me */");
            assert.strictEqual(ast.print_to_string({comments: "some"}), "#!foo\n/*@preserve*/");
        });

        it("Should have no problem on multiple calls", async function() {
            const options = {
                comments: /ok/
            };

            assert.strictEqual(parse("/* ok */function a(){}").print_to_string(options), "/* ok */function a(){}");
            assert.strictEqual(parse("/* ok */function a(){}").print_to_string(options), "/* ok */function a(){}");
            assert.strictEqual(parse("/* ok */function a(){}").print_to_string(options), "/* ok */function a(){}");
        });

        it("Should handle shebang and preamble correctly", async function() {
            var code = (await minify("#!/usr/bin/node\nvar x = 10;", {
                output: { preamble: "/* Build */" }
            })).code;
            assert.strictEqual(code, "#!/usr/bin/node\n/* Build */\nvar x=10;");
        });

        it("Should handle preamble without shebang correctly", async function() {
            var code = (await minify("var x = 10;", {
                output: { preamble: "/* Build */" }
            })).code;
            assert.strictEqual(code, "/* Build */\nvar x=10;");
        });
    });

    describe("Huge number of comments.", function() {
        it("Should parse and compress code with thousands of consecutive comments", async function() {
            var js = "function lots_of_comments(x) { return 7 -";
            for (var i = 1; i <= 5000; ++i) js += "// " + i + "\n";
            for (; i <= 10000; ++i) js += "/* " + i + " */ /**/";
            js += "x; }";
            var result = await minify(js, { mangle: false });
            assert.strictEqual(result.code, "function lots_of_comments(x){return 7-x}");
        });
    });
});
