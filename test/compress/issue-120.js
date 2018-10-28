
issue_120: {
    options = {
        defaults: true,
        inline: 3
    }
    input: {
        function f(){for(var t=o=>{var i=+o;return i+i};t(););}
    }
    expect_exact: "function f(){for(var t=o=>{var i=+o;return i+i};t(););}"
}

issue_120_2: {
    options = {
        defaults: true,
        inline: 3
    }
    input: {
        for(var t=o=>{var i=+o;return i+i};t(););
    }
    expect_exact: "for(var t=o=>{var i=+o;return i+i};t(););"
}

issue_120_3: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        join_vars: true,
        loops: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function foo(node) {
            var traverse = function(obj) {
                var i = obj.data;
                return i && i.a != i.b;
            };
            while (traverse(node)) {
                node = node.data;
            }
            return node;
        }
        var x = {
            a: 1,
            b: 2,
            data: {
                a: "hello",
            }
        };
        console.log(foo(x).a, foo({a : "world"}).a);
    }
    expect: {
        function foo(node) {
            for (var traverse = function(obj) {
                var i = obj.data;
                return i && i.a != i.b;
            }; traverse(node); ) node = node.data;
            return node;
        }
        var x = {
            a: 1,
            b: 2,
            data: {
                a: "hello"
            }
        };
        console.log(foo(x).a, foo({
            a: "world"
        }).a);
    }
    expect_stdout: "hello world"
}
