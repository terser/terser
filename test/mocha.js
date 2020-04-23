#!/usr/bin/env node
/* globals module, __dirname, console */

try {
    require("source-map-support").install();
} catch (err) {}

var fs = require("fs");
var path = require("path");

// Instantiate a Mocha instance
var Mocha = process.env.CI || process.argv.length > 2
    ? require("mocha")
    : require("mochallel");

var mocha = new Mocha({
    timeout: 5000
});
var testDir = path.join(__dirname, "mocha");

if (process.argv.length > 2) {
    process.argv.slice(2).forEach(file => {
        mocha.addFile(file);
    });
} else {
    // Add each .js file to the Mocha instance
    fs.readdirSync(testDir).filter(function(file) {
        return /\.js$/.test(file);
    }).forEach(function(file) {
        mocha.addFile(path.join(testDir, file));
    });
}

module.exports = function() {
    mocha.run(function(failures) {
        if (failures) process.on("exit", function() {
            process.exit(failures);
        });
    });
};

if (module.parent === null) {
    module.exports();
}
