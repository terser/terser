var assert = require("assert");
var exec = require("child_process").exec;
var readFileSync = require("fs").readFileSync;

function read(path) {
    return readFileSync(path, "utf8");
}

describe("bin/uglifyjs", function() {
    var uglifyjscmd = '"' + process.argv[0] + '" bin/uglifyjs';
    it("Should be able to filter comments correctly with `--comments all`", function (done) {
        var command = uglifyjscmd + ' test/input/comments/filter.js --comments all';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "// foo\n/*@preserve*/\n// bar\n\n");
            done();
        });
    });
    it("Should be able to filter comments correctly with `--comment <RegExp>`", function (done) {
        this.timeout(10 * 1000);
        var command = uglifyjscmd + ' test/input/comments/filter.js --comments /r/';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "/*@preserve*/\n// bar\n\n");
            done();
        });
    });
    it("Should be able to filter comments correctly with just `--comment`", function (done) {
        var command = uglifyjscmd + ' test/input/comments/filter.js --comments';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "/*@preserve*/\n\n");
            done();
        });
    });
    it("Should append source map to output when using --source-map url=inline", function (done) {
        var command = uglifyjscmd + " test/input/issue-1323/sample.js --source-map url=inline";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "var bar=function(){function foo(bar){return bar}return foo}();\n" +
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvaW5wdXQvaXNzdWUtMTMyMy9zYW1wbGUuanMiXSwibmFtZXMiOlsiYmFyIiwiZm9vIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxJQUFNLFdBQ04sU0FBU0MsSUFBS0QsS0FDVixPQUFPQSxJQUdYLE9BQU9DLElBTEQifQ==\n");
            done();
        });
    });
    it("Should not append source map to output when not using --source-map url=inline", function (done) {
        var command = uglifyjscmd + ' test/input/issue-1323/sample.js';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "var bar=function(){function foo(bar){return bar}return foo}();\n");
            done();
        });
    });
    it("Should work with --keep-fnames (mangle only)", function (done) {
        var command = uglifyjscmd + ' test/input/issue-1431/sample.js --keep-fnames -m';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "function f(r){return function(){function n(n){return n*n}return r(n)}}function g(n){return n(1)+n(2)}console.log(f(g)()==5);\n");
            done();
        });
    });
    it("Should work with --keep-fnames (mangle & compress)", function (done) {
        var command = uglifyjscmd + ' test/input/issue-1431/sample.js --keep-fnames -m -c unused=false';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "function f(r){return function(){function n(n){return n*n}return r(n)}}function g(n){return n(1)+n(2)}console.log(5==f(g)());\n");
            done();
        });
    });
    it("Should work with keep_fnames under mangler options", function (done) {
        var command = uglifyjscmd + ' test/input/issue-1431/sample.js -m keep_fnames=true';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "function f(r){return function(){function n(n){return n*n}return r(n)}}function g(n){return n(1)+n(2)}console.log(f(g)()==5);\n");
            done();
        });
    });
    it("Should work with --define (simple)", function (done) {
        var command = uglifyjscmd + ' test/input/global_defs/simple.js --define D=5 -c';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "console.log(5);\n");
            done();
        });
    });
    it("Should work with --define (nested)", function (done) {
        var command = uglifyjscmd + ' test/input/global_defs/nested.js --define C.D=5,C.V=3 -c';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "console.log(3,5);\n");
            done();
        });
    });
    it("Should work with --define (AST_Node)", function (done) {
        var command = uglifyjscmd + ' test/input/global_defs/simple.js --define console.log=stdout.println -c';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "stdout.println(D);\n");
            done();
        });
    });
    it("Should work with `--beautify`", function (done) {
        var command = uglifyjscmd + ' test/input/issue-1482/input.js -b';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, read("test/input/issue-1482/default.js"));
            done();
        });
    });
    it("Should work with `--beautify braces`", function (done) {
        var command = uglifyjscmd + ' test/input/issue-1482/input.js -b braces';

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, read("test/input/issue-1482/braces.js"));
            done();
        });
    });
    it("Should process inline source map", function(done) {
        var command = uglifyjscmd + " test/input/issue-520/input.js -mc toplevel --source-map content=inline,url=inline";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, read("test/input/issue-520/output.js"));
            done();
        });
    });
    it("Should warn for missing inline source map", function(done) {
        var command = uglifyjscmd + " test/input/issue-1323/sample.js --source-map content=inline,url=inline,includeSources=true";

        exec(command, function (err, stdout, stderr) {
            if (err) throw err;

            assert.strictEqual(stdout, [
                "var bar=function(){function foo(bar){return bar}return foo}();",
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvaW5wdXQvaXNzdWUtMTMyMy9zYW1wbGUuanMiXSwibmFtZXMiOlsiYmFyIiwiZm9vIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxJQUFNLFdBQ04sU0FBU0MsSUFBS0QsS0FDVixPQUFPQSxJQUdYLE9BQU9DLElBTEQiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBmb28gKGJhcikge1xuICAgICAgICByZXR1cm4gYmFyO1xuICAgIH1cblxuICAgIHJldHVybiBmb287XG59KSgpOyJdfQ==",
                "",
            ].join("\n"));
            assert.strictEqual(stderr, "WARN: inline source map not found: test/input/issue-1323/sample.js\n");
            done();
        });
    });
    it("Should handle multiple input and inline source map", function(done) {
        var command = [
            uglifyjscmd,
            "test/input/issue-520/input.js",
            "test/input/issue-1323/sample.js",
            "--source-map", "content=inline,url=inline,includeSources=true",
        ].join(" ");

        exec(command, function (err, stdout, stderr) {
            if (err) throw err;

            assert.strictEqual(stdout, [
                "var Foo=function Foo(){console.log(1+2)};new Foo;var bar=function(){function foo(bar){return bar}return foo}();",
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0ZGluIiwidGVzdC9pbnB1dC9pc3N1ZS0xMzIzL3NhbXBsZS5qcyJdLCJuYW1lcyI6WyJGb28iLCJjb25zb2xlIiwibG9nIiwiYmFyIiwiZm9vIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSxJQUFJLFNBQUFBLE1BQWdCQyxRQUFRQyxJQUFJLEVBQUUsSUFBTyxJQUFJRixJQ0FuRCxJQUFJRyxJQUFNLFdBQ04sU0FBU0MsSUFBS0QsS0FDVixPQUFPQSxJQUdYLE9BQU9DLElBTEQiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBGb28geyBjb25zdHJ1Y3Rvcigpe2NvbnNvbGUubG9nKDErMik7fSB9IG5ldyBGb28oKTtcbiIsInZhciBiYXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGZvbyAoYmFyKSB7XG4gICAgICAgIHJldHVybiBiYXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvbztcbn0pKCk7Il19",
                "",
            ].join("\n"));
            assert.strictEqual(stderr, "WARN: inline source map not found: test/input/issue-1323/sample.js\n");
            done();
        });
    });
    it("Should infer source maps in auto mode", function(done) {
        this.timeout(30 * 1000);
        var command = [
            uglifyjscmd,
            "test/input/issue-3219/file.js",
            "test/input/issue-3219/http.js",
            "test/input/issue-3219/infer1.js",
            "test/input/issue-3219/infer2.js",
            "test/input/issue-3219/inline.js",
            "--source-map", "content=auto,includeSources=true,url=inline",
        ].join(" ");
        exec(command, {maxBuffer: 1024 * 300}, function(err, stdout) {
            if (err) throw err;
            assert.strictEqual(stdout, read("test/input/issue-3219/output1.js"));
            done();
        });
    });
    it("Should prefer CLI source map locations over auto resolution strategy", function(done) {
        var command = [
            uglifyjscmd,
            "test/input/issue-3219/file2.js",
            "test/input/issue-3219/file3.js",
            "--source-map", "\"content=auto,contents=test/input/issue-3219/file2.js*test/input/issue-3219/mapping2.js.map|test/input/issue-3219/file3.js*test/input/issue-3219/mapping3.js.map,includeSources=true,url=inline\"",
        ].join(" ");
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            if (stderr) throw new Error(stderr);
            assert.strictEqual(stdout, read("test/input/issue-3219/output2.js"));
            done();
        });
    });
    it("Should fail with invalid syntax", function(done) {
        var command = uglifyjscmd + ' test/input/invalid/simple.js';

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
        var command = uglifyjscmd + ' test/input/invalid/tab.js';

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
        var command = uglifyjscmd + ' test/input/invalid/eof.js';

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
