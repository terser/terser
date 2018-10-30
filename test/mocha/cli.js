var assert = require("assert");
var exec = require("child_process").exec;
var readFileSync = require("fs").readFileSync;
var semver = require("semver");

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
    it("Should not consider source map file content as source map file name (issue #2082)", function (done) {
        var command = [
            uglifyjscmd,
            "test/input/issue-2082/sample.js",
            "--source-map", "content=test/input/issue-2082/sample.js.map",
            "--source-map", "url=inline",
        ].join(" ");

        exec(command, function (err, stdout, stderr) {
            if (err) throw err;

            var stderrLines = stderr.split('\n');
            assert.strictEqual(stderrLines[0], 'INFO: Using input source map: test/input/issue-2082/sample.js.map');
            assert.notStrictEqual(stderrLines[1], 'INFO: Using input source map: {"version": 3,"sources": ["index.js"],"mappings": ";"}');
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
        var command = uglifyjscmd + " test/input/issue-1323/sample.js --source-map content=inline,url=inline";

        exec(command, function (err, stdout, stderr) {
            if (err) throw err;

            assert.strictEqual(stdout, [
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
        var command = uglifyjscmd + " test/input/issue-520/input.js test/input/issue-520/output.js --source-map content=inline,url=inline";

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stderr.split(/\n/)[0], "ERROR: inline source map only works with singular input");
            done();
        });
    });
    it("Should fail with acorn and inline source map", function(done) {
        var command = uglifyjscmd + " test/input/issue-520/input.js --source-map content=inline,url=inline -p acorn";

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stderr, "ERROR: inline source map only works with built-in parser\n");
            done();
        });
    });
    it("Should fail with SpiderMonkey and inline source map", function(done) {
        var command = uglifyjscmd + " test/input/issue-520/input.js --source-map content=inline,url=inline -p spidermonkey";

        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stderr, "ERROR: inline source map only works with built-in parser\n");
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
    it("Should handle literal string as source map input", function(done) {
        var command = [
            uglifyjscmd,
            "test/input/issue-1236/simple.js",
            "--source-map",
            'content="' + read_map() + '",url=inline'
        ].join(" ");

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, [
                '"use strict";var foo=function foo(x){return"foo "+x};console.log(foo("bar"));',
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImZvbyIsIngiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiYUFBQSxJQUFJQSxJQUFNLFNBQU5BLElBQU1DLEdBQUEsTUFBSyxPQUFTQSxHQUN4QkMsUUFBUUMsSUFBSUgsSUFBSSJ9",
                ""
            ].join("\n"));
            done();
        });

        function read_map() {
            var map = JSON.parse(read("./test/input/issue-1236/simple.js.map"));
            delete map.sourcesContent;
            return JSON.stringify(map).replace(/"/g, '\\"');
        }
    });
    it("Should include function calls in source map", function(done) {
        var command = [
            uglifyjscmd,
            "test/input/issue-2310/input.js",
            "-c",
            "--source-map", "url=inline",
        ].join(" ");

        exec(command, function(err, stdout, stderr) {
            if (err) throw err;

            assert.strictEqual(stdout, [
                'function foo(){return function(){console.log("PASS")}}foo()();',
                "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvaW5wdXQvaXNzdWUtMjMxMC9pbnB1dC5qcyJdLCJuYW1lcyI6WyJmb28iLCJjb25zb2xlIiwibG9nIiwiZiJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBU0EsTUFDTCxPQUFPLFdBQ0hDLFFBQVFDLElBQUksU0FLUkYsS0FDUkcifQ==",
                ""
            ].join("\n"));
            done();
        });
    });
    it("Should dump AST as JSON", function(done) {
        var command = uglifyjscmd + " test/input/global_defs/simple.js -mco ast";
        exec(command, function (err, stdout) {
            if (err) throw err;

            var ast = JSON.parse(stdout);
            assert.strictEqual(ast._class, "AST_Toplevel");
            assert.ok(Array.isArray(ast.body));
            done();
        });
    });
    it("Should print supported options on invalid option syntax", function(done) {
        var command = uglifyjscmd + " test/input/comments/filter.js -b ascii-only";
        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stdout, "");
            assert.ok(/^Supported options:\n[\s\S]*?\nERROR: `ascii-only` is not a supported option/.test(stderr), stderr);
            done();
        });
    });
    it("Should work with --mangle reserved=[]", function(done) {
        var command = uglifyjscmd + " test/input/issue-505/input.js -m reserved=[callback]";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, 'function test(callback){"aaaaaaaaaaaaaaaa";callback(err,data);callback(err,data)}\n');
            done();
        });
    });
    it("Should work with --mangle reserved=false", function(done) {
        var command = uglifyjscmd + " test/input/issue-505/input.js -m reserved=false";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, 'function test(a){"aaaaaaaaaaaaaaaa";a(err,data);a(err,data)}\n');
            done();
        });
    });
    it("Should fail with --mangle-props reserved=[in]", function(done) {
        var command = uglifyjscmd + " test/input/issue-505/input.js --mangle-props reserved=[in]";
        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stdout, "");
            assert.ok(/^Supported options:\n[\s\S]*?\nERROR: `reserved=\[in]` is not a supported option/.test(stderr), stderr);
            done();
        });
    });
    it("Should mangle toplevel names with the --module option", function(done) {
        var command = uglifyjscmd + " test/input/module/input.js --module -mc";
        exec(command, function (err, stdout, stderr) {
            if (err) throw err;

            assert.strictEqual(stdout, "let e=1;export{e as foo};\n")
            done();
        });
    });
    it("Should fail with --define a-b", function(done) {
        var command = uglifyjscmd + " test/input/issue-505/input.js --define a-b";
        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stdout, "");
            assert.strictEqual(stderr, "Error parsing arguments for 'define': a-b\n");
            done();
        });
    });
    it("Should work with -c defaults=false,conditionals", function(done) {
        var command = uglifyjscmd + " test/input/defaults/input.js -c defaults=false,conditionals";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, 'true&&console.log(1+2);\n');
            done();
        });
    });
    it("Should work with --enclose", function(done) {
        var command = uglifyjscmd + " test/input/enclose/input.js --enclose";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(){function enclose(){console.log("test enclose")}enclose()})();\n');
            done();
        });
    });
    it("Should work with --enclose arg", function(done) {
        var command = uglifyjscmd + " test/input/enclose/input.js --enclose undefined";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(undefined){function enclose(){console.log("test enclose")}enclose()})();\n');
            done();
        });
    });
    it("Should work with --enclose arg:value", function(done) {
        var command = uglifyjscmd + " test/input/enclose/input.js --enclose window,undefined:window";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(window,undefined){function enclose(){console.log("test enclose")}enclose()})(window);\n');
            done();
        });
    });
    it("Should work with --enclose & --wrap", function(done) {
        var command = uglifyjscmd + " test/input/enclose/input.js --enclose window,undefined:window --wrap exports";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(window,undefined){(function(exports){function enclose(){console.log("test enclose")}enclose()})(typeof exports=="undefined"?exports={}:exports)})(window);\n');
            done();
        });
    });
});
