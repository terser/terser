issue_1779: {
    input: {
        function setup(debug) {
            if (debug) {
                function log(msg) { return "[debug] " + msg; }
            } else {
                function log(msg) { return msg; }
            }
            return log("hi");
        }
        console.log(setup(true), setup(false));
    }
    expect_stdout: true
}

issue_1779_single_branch: {
    input: {
        function f() {
            if (x) {
                function g() { return 1; }
            }
            return typeof g;
        }
        var x = false;
        console.log(f());
        x = true;
        console.log(f());
    }
    expect_stdout: true
}

issue_1779_unbraced: {
    input: {
        function f() {
            if (x) function g() { return 1; }
            return typeof g;
        }
        var x = false;
        console.log(f());
        x = true;
        console.log(f());
    }
    expect_stdout: true
}

issue_1779_plain_block: {
    input: {
        function f() {
            {
                function g() { return 1; }
            }
            return g();
        }
        console.log(f());
    }
    expect_stdout: true
}

issue_1779_within_block: {
    input: {
        function f() {
            if (x) {
                g();
                function g() { console.log("ok"); }
            }
            var x = true;
        }
        f();
    }
    expect_stdout: true
}
