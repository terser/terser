var fs = require("fs");
var Mocha = require("mocha");
var Mochallel = require("mochallel");
var path = require("path");

// Instantiate a Mocha instance
var mocha = new (process.env.TRAVIS ? Mocha : Mochallel)({
    timeout: 5000
});
var testDir = __dirname + "/mocha/";

// Add each .js file to the Mocha instance
fs.readdirSync(testDir).filter(function(file) {
    return /\.js$/.test(file);
}).forEach(function(file) {
    mocha.addFile(path.join(testDir, file));
});

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
