var assert = require("assert");
var exec = require("child_process").exec;

describe("bin/terser", function() {
    var tersercmd = '"' + process.argv[0] + '" bin/terser';
    it("Should be able to filter comments correctly with `--comments false`", function (done) {
        var command = tersercmd + " test/input/issue-585/input.js --comments false";

        exec(command, function (err, stdout) {
            if (err) throw err;

            assert.strictEqual(stdout, "\n");
            done();
        });
    });
});
