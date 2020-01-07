no_flatten_with_arg_colliding_with_arg_value_inner_scope: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var g = ["a"];
        function problem(arg) {
            return g.indexOf(arg);
        }
        function unused(arg) {
            return problem(arg);
        }
        function a(arg) {
            return problem(arg);
        }
        function b(problem) {
            return g[problem];
        }
        function c(arg) {
            return b(a(arg));
        }
        console.log(c("a"));
    }
    expect: {
        var g=["a"];
        function problem(arg) {
            return g.indexOf(arg)
        }
        console.log(function(problem) {
            return g[problem]
        }(function(arg) {
            return problem(arg)
        }("a")));
    }
    expect_stdout: "a"
}

no_flatten_with_var_colliding_with_arg_value_inner_scope: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var g = ["a"];
        function problem(arg) {
            return g.indexOf(arg);
        }
        function unused(arg) {
            return problem(arg);
        }
        function a(arg) {
            return problem(arg);
        }
        function b(test) {
            var problem = test * 2;
            console.log(problem);
            return g[problem];
        }
        function c(arg) {
            return b(a(arg));
        }
        console.log(c("a"));
    }
    expect: {
        var g=["a"];
        function problem(arg){return g.indexOf(arg)}
        console.log(function(test){var problem=2*test;return console.log(problem),g[problem]}(function(arg){return problem(arg)}("a")));
    }
    expect_stdout: [
        "0",
        "a",
    ]
}
