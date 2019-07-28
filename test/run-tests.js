#! /usr/bin/env node

var run_compress_tests = require("./compress.js")

run_compress_tests();

if (process.argv.length > 2) {
    // User specified a specific compress/ test, don't run entire test suite
    return;
}

var mocha_tests = require("./mocha.js");
mocha_tests();
