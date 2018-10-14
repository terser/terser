"use strict"

var assert = require("assert");
var spawn = require("child_process").spawn;

function run(command, args, done) {
    spawn(command, args, {
        stdio: [ "ignore", 1, 2 ]
    }).on("exit", function(code) {
        assert.strictEqual(code, 0);
        done();
    });
}

exports.run = run;
