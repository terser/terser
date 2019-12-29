var assert = require("assert");
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;
var fs = require("fs");
var {assertCodeWithInlineMapEquals} = require("./utils");

function read(path) {
    return fs.readFileSync(path, "utf8");
}

describe("bin/terser", function() {
    var tersercmd = '"' + process.argv[0] + '" bin/terser';
    it("Should be able to filter comments correctly with `--comments all`", function (done) {
        var command = tersercmd + ' test/input/comments/filter.js --comments all';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "// foo\n/*@preserve*/\n// bar\n\n");
            done();
        });
    });
    it("Should be able to filter comments correctly with `--comment <RegExp>`", function (done) {
        this.timeout(10 * 1000);
        var command = tersercmd + ' test/input/comments/filter.js --comments /r/';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "/*@preserve*/\n// bar\n\n");
            done();
        });
    });
    it("Should be able to filter comments correctly with just `--comment`", function (done) {
        var command = tersercmd + ' test/input/comments/filter.js --comments';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "/*@preserve*/\n\n");
            done();
        });
    });
    it("Should append source map to output when using --source-map url=inline", function (done) {
        var command = tersercmd + " test/input/issue-1323/sample.js --source-map url=inline";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assertCodeWithInlineMapEquals(stdout, "var bar=function(){function foo(bar){return bar}return foo}();\n" +
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvaW5wdXQvaXNzdWUtMTMyMy9zYW1wbGUuanMiXSwibmFtZXMiOlsiYmFyIiwiZm9vIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxJQUFNLFdBQ04sU0FBU0MsSUFBS0QsS0FDVixPQUFPQSxJQUdYLE9BQU9DLElBTEQifQ==\n");
            done();
        });
    });
    it("Should not append source map to output when not using --source-map url=inline", function (done) {
        var command = tersercmd + ' test/input/issue-1323/sample.js';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "var bar=function(){function foo(bar){return bar}return foo}();\n");
            done();
        });
    });
    it("Should not load source map before finish reading from STDIN", function(done) {
        var mapFile = "tmp/input.js.map";
        try {
            fs.mkdirSync("./tmp");
        } catch (e) {
            if (e.code != "EEXIST") throw e;
        }
        try {
            fs.unlinkSync(mapFile);
        } catch (e) {
            if (e.code != "ENOENT") throw e;
        }
        var command = [
            tersercmd,
            "--source-map", "content=" + mapFile,
            "--source-map", "url=inline"
        ].join(" ");

        var child = exec(command, function(err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, read("test/input/source-maps/expect.js"));
            done();
        });
        setTimeout(function() {
            fs.writeFileSync(mapFile, read("test/input/source-maps/input.js.map"));
            child.stdin.end(read("test/input/source-maps/input.js"));
        }, 1000);
    });
    it("Should work with --keep-fnames (mangle only)", function (done) {
        var command = tersercmd + ' test/input/issue-1431/sample.js --keep-fnames -m';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "function f(r){return function(){function n(r){return r*r}return r(n)}}function g(r){return r(1)+r(2)}console.log(f(g)()==5);\n");
            done();
        });
    });
    it("Should work with --keep-fnames (mangle & compress)", function (done) {
        var command = tersercmd + ' test/input/issue-1431/sample.js --keep-fnames -m -c unused=false';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "function f(r){return function(){function n(r){return r*r}return r(n)}}function g(r){return r(1)+r(2)}console.log(5==f(g)());\n");
            done();
        });
    });
    it("Should work with keep_fnames under mangler options", function (done) {
        var command = tersercmd + ' test/input/issue-1431/sample.js -m keep_fnames=true';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "function f(r){return function(){function n(r){return r*r}return r(n)}}function g(r){return r(1)+r(2)}console.log(f(g)()==5);\n");
            done();
        });
    });
    it("Should work with --define (simple)", function (done) {
        var command = tersercmd + ' test/input/global_defs/simple.js --define D=5 -c';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "console.log(5);\n");
            done();
        });
    });
    it("Should work with --define (nested)", function (done) {
        var command = tersercmd + ' test/input/global_defs/nested.js --define C.D=5,C.V=3 -c';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "console.log(3,5);\n");
            done();
        });
    });
    it("Should work with --define (AST_Node)", function (done) {
        var command = tersercmd + ' test/input/global_defs/simple.js --define console.log=stdout.println -c';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "stdout.println(D);\n");
            done();
        });
    });
    it("Should work with `--beautify`", function (done) {
        var command = tersercmd + ' test/input/issue-1482/input.js -b';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, read("test/input/issue-1482/default.js"));
            done();
        });
    });
    it("Should work with `--beautify braces`", function (done) {
        var command = tersercmd + ' test/input/issue-1482/input.js -b braces';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, read("test/input/issue-1482/braces.js"));
            done();
        });
    });
    it("Should process inline source map", function(done) {
        var command = tersercmd + " test/input/issue-520/input.js -mc toplevel --source-map content=inline,url=inline";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assertCodeWithInlineMapEquals(stdout, read("test/input/issue-520/output.js"));
            done();
        });
    });
    it("Should warn for missing inline source map", function(done) {
        var command = tersercmd + " test/input/issue-1323/sample.js --source-map content=inline,url=inline";

        exec(command, function (err, stdout, stderr) {
            if (err) throw err;

            assertCodeWithInlineMapEquals(stdout, [
                "var bar=function(){function foo(bar){return bar}return foo}();",
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvaW5wdXQvaXNzdWUtMTMyMy9zYW1wbGUuanMiXSwibmFtZXMiOlsiYmFyIiwiZm9vIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxJQUFNLFdBQ04sU0FBU0MsSUFBS0QsS0FDVixPQUFPQSxJQUdYLE9BQU9DLElBTEQifQ==",
                "",
            ].join("\n"));
            assert.strictEqual(stderr, "WARN: inline source map not found\n");
            done();
        });
    });
    it("Should fail with multiple input and inline source map", function(done) {
        this.timeout(60000);
        var command = tersercmd + " test/input/issue-520/input.js test/input/issue-520/output.js --source-map content=inline,url=inline";

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stderr.split(/\n/)[0], "ERROR: inline source map only works with singular input");
            done();
        });
    });
    it("Should fail with acorn and inline source map", function(done) {
        var command = tersercmd + " test/input/issue-520/input.js --source-map content=inline,url=inline -p acorn";

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stderr, "ERROR: inline source map only works with built-in parser\n");
            done();
        });
    });
    it("Should fail with SpiderMonkey and inline source map", function(done) {
        var command = tersercmd + " test/input/issue-520/input.js --source-map content=inline,url=inline -p spidermonkey";

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stderr, "ERROR: inline source map only works with built-in parser\n");
            done();
        });
    });
    it("Should fail with invalid syntax", function(done) {
        var command = tersercmd + ' test/input/invalid/simple.js';

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            var lines = stderr.split(/\n/);
            assert.strictEqual(lines[0], "Parse error at test/input/invalid/simple.js:1,12");
            assert.strictEqual(lines[1], "function f(a{}");
            assert.strictEqual(lines[2], "            ^");
            assert.strictEqual(lines[3], "ERROR: Unexpected token punc «{», expected punc «,»");
            done();
        });
    });
    it("Should fail with correct marking of tabs", function(done) {
        var command = tersercmd + ' test/input/invalid/tab.js';

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            var lines = stderr.split(/\n/);
            assert.strictEqual(lines[0], "Parse error at test/input/invalid/tab.js:1,12");
            assert.strictEqual(lines[1], "\t\tfoo(\txyz, 0abc);");
            assert.strictEqual(lines[2], "\t\t    \t     ^");
            assert.strictEqual(lines[3], "ERROR: Invalid syntax: 0abc");
            done();
        });
    });
    it("Should fail with correct marking at start of line", function(done) {
        var command = tersercmd + ' test/input/invalid/eof.js';

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            var lines = stderr.split(/\n/);
            assert.strictEqual(lines[0], "Parse error at test/input/invalid/eof.js:2,0");
            assert.strictEqual(lines[1], "foo, bar(");
            assert.strictEqual(lines[2], "         ^");
            assert.strictEqual(lines[3], "ERROR: Unexpected token: eof (undefined)");
            done();
        });
    });
});
