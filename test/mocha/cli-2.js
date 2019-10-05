var assert = require("assert");
var exec = require("child_process").exec;
var readFileSync = require("fs").readFileSync;

function read(path) {
    return readFileSync(path, "utf8");
}

describe("bin/terser (2)", function() {
    var tersercmd = '"' + process.argv[0] + '" bin/terser';
    it("Should handle literal string as source map input", function(done) {
        var command = [
            tersercmd,
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
            tersercmd,
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
        var command = tersercmd + " test/input/global_defs/simple.js -mco ast";
        exec(command, function (err, stdout) {
            if (err) throw err;

            var ast = JSON.parse(stdout);
            assert.strictEqual(ast._class, "AST_Toplevel");
            assert.ok(Array.isArray(ast.body));
            done();
        });
    });
    it("Should print supported options on invalid option syntax", function(done) {
        var command = tersercmd + " test/input/comments/filter.js -b ascii-only";
        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stdout, "");
            assert.ok(/^Supported options:\n[\s\S]*?\nERROR: `ascii-only` is not a supported option/.test(stderr), stderr);
            done();
        });
    });
    it("Should work with --mangle reserved=[]", function(done) {
        var command = tersercmd + " test/input/issue-505/input.js -m reserved=[callback]";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, 'function test(callback){"aaaaaaaaaaaaaaaa";callback(err,data);callback(err,data)}\n');
            done();
        });
    });
    it("Should work with --mangle reserved=false", function(done) {
        var command = tersercmd + " test/input/issue-505/input.js -m reserved=false";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, 'function test(a){"aaaaaaaaaaaaaaaa";a(err,data);a(err,data)}\n');
            done();
        });
    });
    it("Should fail with --mangle-props reserved=[in]", function(done) {
        var command = tersercmd + " test/input/issue-505/input.js --mangle-props reserved=[in]";
        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stdout, "");
            assert.ok(/^Supported options:\n[\s\S]*?\nERROR: `reserved=\[in]` is not a supported option/.test(stderr), stderr);
            done();
        });
    });
    it("Should mangle toplevel names with the --module option", function(done) {
        var command = tersercmd + " test/input/module/input.js --module -mc";
        exec(command, function (err, stdout, stderr) {
            if (err) throw err;

            assert.strictEqual(stdout, "let e=1;export{e as foo};\n")
            done();
        });
    });
    it("Should fail with --define a-b", function(done) {
        var command = tersercmd + " test/input/issue-505/input.js --define a-b";
        exec(command, function (err, stdout, stderr) {
            assert.ok(err);
            assert.strictEqual(stdout, "");
            assert.strictEqual(stderr, "Error parsing arguments for 'define': a-b\n");
            done();
        });
    });
    it("Should work with -c defaults=false,conditionals", function(done) {
        var command = tersercmd + " test/input/defaults/input.js -c defaults=false,conditionals";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, 'true&&console.log(1+2);\n');
            done();
        });
    });
    it("Should work with --enclose", function(done) {
        var command = tersercmd + " test/input/enclose/input.js --enclose";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(){function enclose(){console.log("test enclose")}enclose()})();\n');
            done();
        });
    });
    it("Should work with --enclose arg", function(done) {
        var command = tersercmd + " test/input/enclose/input.js --enclose undefined";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(undefined){function enclose(){console.log("test enclose")}enclose()})();\n');
            done();
        });
    });
    it("Should work with --enclose arg:value", function(done) {
        var command = tersercmd + " test/input/enclose/input.js --enclose window,undefined:window";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(window,undefined){function enclose(){console.log("test enclose")}enclose()})(window);\n');
            done();
        });
    });
    it("Should work with --enclose & --wrap", function(done) {
        var command = tersercmd + " test/input/enclose/input.js --enclose window,undefined:window --wrap exports";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, '(function(window,undefined){(function(exports){function enclose(){console.log("test enclose")}enclose()})(typeof exports=="undefined"?exports={}:exports)})(window);\n');
            done();
        });
    });
    it("should read files list from config file", (done) => {
        var command = tersercmd + " --config-file test/input/config-file/cf.json";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, 'console.log("First"),console.log("Second");\n');
            done();
        });
    });
    it("should parse regex options correctly", (done) => {
        var command = tersercmd + " --toplevel -m keep_fnames=/1$/ --mangle-props regex=/^_/ test/input/issue-483/input.js";
        exec(command, function(err, stdout, stderr) {
            if (err) throw err;
            assert.strictEqual(stdout, "function func1(n){n.u=false}function n(n){n.nonPrivateProperty=true}\n");
            done();
        });
    });
});
