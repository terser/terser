var assert = require("assert");
var semver = require("semver");
var run = require("../release").run;

if (!process.env.UGLIFYJS_TEST_ALL) return;
if (semver.satisfies(process.version, "0.12")) return;
if (semver.satisfies(process.version, "4")) return;

// have node 10 skip jetstream test until stream truncation issue resolved
// https://github.com/fabiosantoscode/terser/issues/56
if (semver.satisfies(process.version, "10")) return;

describe("test/jetstream.js", function() {
    this.timeout(20 * 60 * 1000);
    [
        "-mc",
        "-mc keep_fargs=false,passes=3,pure_getters,unsafe,unsafe_comps,unsafe_math,unsafe_proto",
    ].forEach(function(options) {
        it("Should pass with options " + options, function(done) {
            var args = options.split(/ /);
            args.unshift("test/jetstream.js");
            args.push("-b", "beautify=false,webkit");
            run(process.argv[0], args, done);
        });
    });
});
