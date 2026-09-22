inline_function_shadowed_by_catch: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        function foo(i, j) {
            const a = function(i, j) {
                return i(j);
            };
            const b = function(i, j) {
                return i === j;
            };
            let r;
            try {
                r = a(i, j);
            } catch (b) {
                throw b;
            }
            return b(r, 4);
        }
        console.log(foo(function(i) {
            return 2 * i;
        }, 2));
    }
    expect_stdout: "true"
}

inline_function_shadowed_by_catch_minimal: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        function foo(i, j) {
            const b = function(i, j) {
                return i === j;
            };
            let r;
            try {
                r = i(j);
            } catch (b) {
                throw b;
            }
            return b(r, 4);
        }
        console.log(foo(function(i) {
            return 2 * i;
        }, 2));
    }
    expect_stdout: "true"
}

inline_var_shadowed_by_catch: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        function foo(i, j) {
            var b = function(i, j) {
                return i === j;
            };
            var r;
            try {
                r = i(j);
            } catch (b) {
                throw b;
            }
            return b(r, 4);
        }
        console.log(foo(function(i) {
            return 2 * i;
        }, 2));
    }
    expect_stdout: "true"
}

inline_function_not_shadowed_by_catch: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        function foo(i, j) {
            const b = function(i, j) {
                return i === j;
            };
            let r;
            try {
                r = i(j);
            } catch (e) {
                throw e;
            }
            return b(r, 4);
        }
        console.log(foo(function(i) {
            return 2 * i;
        }, 2));
    }
    expect_stdout: "true"
}
