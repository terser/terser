block_before_function: {
    input: {
        function f() {
            { function g() { return 1; } }
            function g() { return 0; }
            return g();
        }
        console.log(f());
    }
    expect_stdout: true
}

function_before_block: {
    input: {
        function f() {
            function g() { return 0; }
            { function g() { return 1; } }
            return g();
        }
        console.log(f());
    }
    expect_stdout: true
}

read_before_block: {
    input: {
        function f() {
            function g() { return 0; }
            var r = g();
            { function g() { return 1; } }
            return r;
        }
        console.log(f());
    }
    expect_stdout: true
}

folded_if_with_else: {
    input: {
        var x = true;
        function f() {
            if (x) {
                function g() { return 1; }
            } else {
                function g() { return 2; }
            }
            return g();
        }
        console.log(f());
    }
    expect_stdout: true
}

folded_if_no_else: {
    input: {
        var x = true;
        function f() {
            if (x) {
                function g() { return 1; }
            }
            function g() { return 0; }
            return g();
        }
        console.log(f());
    }
    expect_stdout: true
}

hoisted_dead_defun_kept: {
    input: {
        function f() {
            return g();
            function g() { return 2; }
        }
        console.log(f());
    }
    expect_stdout: true
}

plain_block_only: {
    input: {
        function f() {
            { function g() { return 1; } }
            return g();
        }
        console.log(f());
    }
    expect_stdout: true
}
