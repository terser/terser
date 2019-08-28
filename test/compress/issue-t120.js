issue_t120_1: {
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
            for (var i; i = void 0, (i = node.data) && i.a != i.b; ) node = node.data;
            return node;
        }
        var x = {
            a: 1,
            b: 2,
            data: {
                a: "hello"
            }
        };
        console.log(foo(x).a, foo({a: "world"}).a);
    }
    expect_stdout: "hello world"
}

issue_t120_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        join_vars: true,
        loops: true,
        passes: 3,
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
            for (var i; (i = node.data) && i.a != i.b; ) node = node.data;
            return node;
        }
        var x = {
            a: 1,
            b: 2,
            data: {
                a: "hello"
            }
        };
        console.log(foo(x).a, foo({a: "world"}).a);
    }
    expect_stdout: "hello world"
}

issue_t120_3: {
    options = {
        defaults: true,
        inline: 3,
        toplevel: true,
    }
    input: {
        for (var t = o => {
            var i = +o;
            return console.log(i + i) && 0;
        }; t(1); ) ;
    }
    expect: {
        for (;i = void 0, i = +1, console.log(i + i), 0; ) ;
        var i;
    }
    expect_stdout: "2"
}

issue_t120_4: {
    options = {
        defaults: true,
        inline: 3,
        toplevel: true,
    }
    input: {
        for (var x = 1, t = o => {
            var i = +o;
            return console.log(i + i) && 0;
        }; x--; t(2)) ;
    }
    expect: {
        for (var x = 1; x--; i = void 0, i = +2, console.log(i + i) && 0) ;
        var i;
    }
    expect_stdout: "4"
}

issue_t120_5: {
    options = {
        defaults: true,
        inline: 3,
        toplevel: true,
    }
    input: {
        for (var x = 1, t = o => {
            var i = +o;
            return console.log(i + i) && 0;
        }; x--; ) t(3);
    }
    expect: {
        for (var x = 1; x--; ) i = void 0, i = +3, console.log(i + i);
        var i;
    }
    expect_stdout: "6"
}

pr_152_regression: {
    reminify: false // TODO: remove when https://github.com/terser/terser/issues/156 fixed
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        join_vars: true,
        loops: true,
        passes: 1,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(root, factory) {
            root.CryptoJS = factory();
        })(this, function() {
            var CryptoJS = CryptoJS || function(Math) {
                var C = {};
                C.demo = function(n) {
                    return Math.ceil(n);
                };
                return C;
            }(Math);
            return CryptoJS;
        });
        var result = this.CryptoJS.demo(1.3);
        console.log(result);
    }
    expect: {
        (function(root, factory) {
            var CryptoJS;
            root.CryptoJS = CryptoJS = CryptoJS || function(Math) {
                var C = {
                    demo: function(n) {
                        return Math.ceil(n);
                    }
                };
                return C;
            }(Math);
        })(this);
        var result = this.CryptoJS.demo(1.3);
        console.log(result);
    }
    expect_stdout: "2"
}
