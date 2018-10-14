var semver = require("semver");
var run = require("../release").run;

if (!process.env.UGLIFYJS_TEST_ALL) return;
if (semver.satisfies(process.version, "0.12")) return;
if (semver.satisfies(process.version, "4")) return;

describe("test/benchmark.js", function() {
    this.timeout(10 * 60 * 1000);
    var options = [
        "-b",
        "-b braces",
    ];
    it("Should pass with options " + options, function(done) {
        var callbacks = options.length;
        options.forEach(function(options) {
            var args = options.split(/ /);
            args.unshift("test/benchmark.js");
            run(process.argv[0], args, onCb);
        });
        function onCb() {
            if (--callbacks == 0)
                done();
        }
    });
});
