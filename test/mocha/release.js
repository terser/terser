import os from "os";
import assert from "assert";
import semver from "semver";
import { spawn } from "child_process";

function run(command, args, done) {
    spawn(command, args, {
        stdio: [ "ignore", 1, 2 ]
    }).on("exit", function(code) {
        assert.strictEqual(code, 0);
        done();
    });
}

describe('release', () => {
    if (!process.env.TERSER_TEST_ALL
        || !semver.satisfies(process.version, "16")
        || process.platform !== "linux"
    ) {
        return;
    }

    describe("test/benchmark.cjs", function() {
        this.timeout(10 * 60 * 1000);
        [
            "-mc toplevel",
            "-mc keep_fargs=false,pure_getters,unsafe,unsafe_comps,unsafe_math,unsafe_proto",
        ].forEach(function(options) {
            it("Should pass with options " + options, function(done) {
                var args = options.split(/ /);
                args.unshift("test/benchmark.cjs");
                args.push("-f", "webkit");
                run(process.argv[0], args, done);
            });
        });
    });

    describe("test/jetstream.cjs", function() {
        this.timeout(20 * 60 * 1000);
        [
            "-mc",
            "-mc keep_fargs=false,pure_getters,unsafe,unsafe_comps,unsafe_math,unsafe_proto",
        ].forEach(function(options) {
            it("Should pass with options " + options, function(done) {
                var args = options.split(/ /);
                args.unshift("test/jetstream.cjs");
                run(process.argv[0], args, done);
            });
        });
    });
});
