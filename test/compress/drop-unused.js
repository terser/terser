unused_funarg_1: {
    options = {
        keep_fargs: false,
        unused: true,
    }
    input: {
        function f(a, b, c, d, e) {
            return a + b;
        }
    }
    expect: {
        function f(a, b) {
            return a + b;
        }
    }
}

unused_funarg_2: {
    options = {
        keep_fargs: false,
        unused: true,
    }
    input: {
        function f(a, b, c, d, e) {
            return a + c;
        }
    }
    expect: {
        function f(a, b, c) {
            return a + c;
        }
    }
}

unused_nested_function: {
    options = {
        unused: true,
    }
    input: {
        function f(x, y) {
            function g() {
                something();
            }
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            return x + y;
        }
    }
}

unused_circular_references_1: {
    options = {
        unused: true,
    }
    input: {
        function f(x, y) {
            // circular reference
            function g() {
                return h();
            }
            function h() {
                return g();
            }
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            return x + y;
        }
    }
}

unused_circular_references_2: {
    options = {
        unused: true,
    }
    input: {
        function f(x, y) {
            var foo = 1, bar = baz, baz = foo + bar, qwe = moo();
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            moo();              // keeps side effect
            return x + y;
        }
    }
}

unused_circular_references_3: {
    options = {
        unused: true,
    }
    input: {
        function f(x, y) {
            var g = function() { return h() };
            var h = function() { return g() };
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            return x + y;
        }
    }
}

unused_keep_setter_arg: {
    options = {
        unused: true,
    }
    input: {
        var x = {
            _foo: null,
            set foo(val) {
            },
            get foo() {
                return this._foo;
            }
        }
    }
    expect: {
        var x = {
            _foo: null,
            set foo(val) {
            },
            get foo() {
                return this._foo;
            }
        }
    }
}

unused_var_in_catch: {
    options = {
        unused: true,
    }
    input: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                var x = 10;
            }
        }
    }
    expect: {
        function foo() {
            try {
                foo();
            } catch(ex) {}
        }
    }
}

used_var_in_catch: {
    options = {
        unused: true,
    }
    input: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                var x = 10;
            }
            return x;
        }
    }
    expect: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                var x = 10;
            }
            return x;
        }
    }
}

unused_block_decls_in_catch: {
    options = { unused: true };
    input: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                let x = 10;
                const y = 10;
                class Zee {};
            }
        }
    }
    expect: {
        function foo() {
            try {
                foo();
            } catch(ex) {}
        }
    }
}

used_block_decls_in_catch: {
    options = { unused: true };
    input: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                let x = 10;
                const y = 10;
                class Zee {};
            }
            console.log(x, y, Zee);
        }
    }
    expect: {
        function foo() {
            try {
                foo();
            } catch(ex) {}
            console.log(x, y, Zee);
        }
    }
}

unused_block_decls: {
    options = { unused: true };
    input: {
        function foo() {
            {
                const x = 1;
            }
            {
                let y;
            }
            console.log(x, y);
        }
    }
    expect: {
        function foo() {
            console.log(x, y);
        }
    }
}

unused_keep_harmony_destructuring: {
    options = { unused: true };
    input: {
        function foo() {
            var {x, y} = foo;
            var a = foo;
        }
    }
    expect:  {
        function foo() {
            var {x, y} = foo;
        }
    }
}

keep_fnames: {
    options = {
        keep_fnames: true,
        unsafe: true,
        unused: true,
    }
    input: {
        function foo() {
            return function bar(baz) {};
        }
    }
    expect: {
        function foo() {
            return function bar(baz) {};
        }
    }
}

drop_assign: {
    options = {
        unused: true,
    }
    input: {
        function f1() {
            var a;
            a = 1;
        }
        function f2() {
            var a = 1;
            a = 2;
        }
        function f3(a) {
            a = 1;
        }
        function f4() {
            var a;
            return a = 1;
        }
        function f5() {
            var a;
            return function() {
                a = 1;
            };
        }
    }
    expect: {
        function f1() {
            0;
        }
        function f2() {
            0;
        }
        function f3(a) {
            0;
        }
        function f4() {
            return 1;
        }
        function f5() {
            return function() {
                0;
            };
        }
    }
}

keep_assign: {
    options = {
        unused: "keep_assign",
    }
    input: {
        function f1() {
            var a;
            a = 1;
        }
        function f2() {
            var a = 1;
            a = 2;
        }
        function f3(a) {
            a = 1;
        }
        function f4() {
            var a;
            return a = 1;
        }
        function f5() {
            var a;
            return function() {
                a = 1;
            };
        }
    }
    expect: {
        function f1() {
            var a;
            a = 1;
        }
        function f2() {
            var a = 1;
            a = 2;
        }
        function f3(a) {
            a = 1;
        }
        function f4() {
            var a;
            return a = 1;
        }
        function f5() {
            var a;
            return function() {
                a = 1;
            };
        }
    }
}

drop_toplevel_funcs: {
    options = {
        toplevel: "funcs",
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, b = 1, c = g;
        a = 2;
        function g() {}
        console.log(b = 3);
    }
}

drop_toplevel_vars: {
    options = {
        toplevel: "vars",
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        function f(d) {
            return function() {
                0;
            };
        }
        0;
        function g() {}
        function h() {}
        console.log(3);
    }
}

drop_toplevel_vars_fargs: {
    options = {
        keep_fargs: false,
        toplevel: "vars",
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        function f() {
            return function() {
                0;
            };
        }
        0;
        function g() {}
        function h() {}
        console.log(3);
    }
}

drop_toplevel_all: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        0;
        console.log(3);
    }
}

drop_toplevel_retain: {
    options = {
        top_retain: "f,a,o",
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a;
        function f(d) {
            return function() {
                0;
            };
        }
        a = 2;
        console.log(3);
    }
}

drop_toplevel_retain_array: {
    options = {
        top_retain: [
            "f",
            "a",
            "o"
        ],
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a;
        function f(d) {
            return function() {
                0;
            };
        }
        a = 2;
        console.log(3);
    }
}

drop_toplevel_retain_regex: {
    options = {
        top_retain: /^[fao]$/,
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a;
        function f(d) {
            return function() {
                0;
            };
        }
        a = 2;
        console.log(3);
    }
}

drop_toplevel_all_retain: {
    options = {
        top_retain: "f,a,o",
        toplevel: true,
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a;
        function f(d) {
            return function() {
                0;
            };
        }
        a = 2;
        console.log(3);
    }
}

drop_toplevel_funcs_retain: {
    options = {
        top_retain: "f,a,o",
        toplevel: "funcs",
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        console.log(b = 3);
    }
}

drop_toplevel_vars_retain: {
    options = {
        top_retain: "f,a,o",
        toplevel: "vars",
        unused: true,
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a;
        function f(d) {
            return function() {
                0;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(3);
    }
}

drop_toplevel_keep_assign: {
    options = {
        toplevel: true,
        unused: "keep_assign",
    }
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            };
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, b = 1;
        a = 2;
        console.log(b = 3);
    }
}

drop_fargs: {
    options = {
        keep_fargs: false,
        unused: true,
    }
    input: {
        function f(a) {
            var b = a;
        }
    }
    expect: {
        function f() {}
    }
}

drop_fnames: {
    options = {
        keep_fnames: false,
        unused: true,
    }
    input: {
        function f() {
            return function g() {
                var a = g;
            };
        }
    }
    expect: {
        function f() {
            return function() {};
        }
    }
}

global_var: {
    options = {
        side_effects: true,
        unused: true,
    }
    input: {
        var a;
        function foo(b) {
            a;
            b;
            c;
            typeof c === "undefined";
            c + b + a;
            b && b.ar();
            return b;
        }
    }
    expect: {
        var a;
        function foo(b) {
            c;
            c;
            b && b.ar();
            return b;
        }
    }
}

iife: {
    options = {
        side_effects: true,
        unused: true,
    }
    input: {
        function f() {
            var a;
            ~function() {}(b);
        }
    }
    expect: {
        function f() {
            b;
        }
    }
}

drop_value: {
    options = {
        side_effects: true,
    }
    input: {
        (1, [2, foo()], 3, {a:1, b:bar()});
    }
    expect: {
        foo(), bar();
    }
}

const_assign: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            const b = 2;
            return 1 + b;
        }

        function g() {
            const b = 2;
            b = 3;
            return 1 + b;
        }
    }
    expect: {
        function f() {
            return 3;
        }

        function g() {
            const b = 2;
            b = 3;
            return 1 + b;
        }
    }
}

issue_1539: {
    options = {
        collapse_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f() {
            var a, b;
            a = b = 42;
            return a;
        }
    }
    expect: {
        function f() {
            return 42;
        }
    }
}

vardef_value: {
    options = {
        keep_fnames: false,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            function g(){
                return x();
            }
            var a = g();
            return a(42);
        }
    }
    expect: {
        function f() {
            var a = function(){
                return x();
            }();
            return a(42);
        }
    }
}

assign_binding: {
    options = {
        collapse_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f() {
            var a;
            a = f.g, a();
        }
    }
    expect: {
        function f() {
            (0, f.g)();
        }
    }
}

assign_chain: {
    options = {
        unused: true,
    }
    input: {
        function f() {
            var a, b;
            x = a = y = b = 42;
        }
    }
    expect: {
        function f() {
            x = y = 42;
        }
    }
}

issue_1583: {
    options = {
        keep_fargs: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function m(t) {
            (function(e) {
                t = e();
            })(function() {
                return (function(a) {
                    return a;
                })(function(a) {});
            });
        }
    }
    expect: {
        function m(t) {
            (function() {
                (function() {
                    return (function(a) {
                        return a;
                    })(function(a) {});
                })();
            })();
        }
    }
}

issue_1656: {
    options = {
        toplevel: true,
        unused: true,
    }
    beautify = {
        beautify: true,
    }
    input: {
        for(var a=0;;);
    }
    expect_exact: "for (;;) ;"
}

issue_1709: {
    options = {
        unused: true,
    }
    input: {
        console.log(
            function x() {
                var x = 1;
                return x;
            }(),
            function y() {
                const y = 2;
                return y;
            }(),
            function z() {
                function z() {}
                return z;
            }()
        );
    }
    expect: {
        console.log(
            function() {
                var x = 1;
                return x;
            }(),
            function() {
                const y = 2;
                return y;
            }(),
            function() {
                function z() {}
                return z;
            }()
        );
    }
    expect_stdout: true
}

issue_1715_1: {
    options = {
        unused: true,
    }
    input: {
        var a = 1;
        function f() {
            a++;
            try {
                x();
            } catch (a) {
                var a;
            }
        }
        f();
        console.log(a);
    }
    expect: {
        var a = 1;
        function f() {
            a++;
            try {
                x();
            } catch (a) {
                var a;
            }
        }
        f();
        console.log(a);
    }
    expect_stdout: "1"
}

issue_1715_2: {
    options = {
        unused: true,
    }
    input: {
        var a = 1;
        function f() {
            a++;
            try {
                x();
            } catch (a) {
                var a = 2;
            }
        }
        f();
        console.log(a);
    }
    expect: {
        var a = 1;
        function f() {
            a++;
            try {
                x();
            } catch (a) {
                var a;
            }
        }
        f();
        console.log(a);
    }
    expect_stdout: "1"
}

issue_1715_3: {
    options = {
        unused: true,
    }
    input: {
        var a = 1;
        function f() {
            a++;
            try {
                console;
            } catch (a) {
                var a = 2 + x();
            }
        }
        f();
        console.log(a);
    }
    expect: {
        var a = 1;
        function f() {
            a++;
            try {
                console;
            } catch (a) {
                var a;
                x();
            }
        }
        f();
        console.log(a);
    }
    expect_stdout: "1"
}

issue_1715_4: {
    options = {
        unused: true,
    }
    input: {
        var a = 1;
        !function a() {
            a++;
            try {
                x();
            } catch (a) {
                var a;
            }
        }();
        console.log(a);
    }
    expect: {
        var a = 1;
        !function() {
            a++;
            try {
                x();
            } catch (a) {
                var a;
            }
        }();
        console.log(a);
    }
    expect_stdout: "1"
}

delete_assign_1: {
    options = {
        booleans: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        console.log(delete (a = undefined));
        console.log(delete (a = void 0));
        console.log(delete (a = Infinity));
        console.log(delete (a = 1 / 0));
        console.log(delete (a = NaN));
        console.log(delete (a = 0 / 0));
    }
    expect: {
        console.log(!0);
        console.log(!0);
        console.log(!0);
        console.log(!0);
        console.log(!0);
        console.log(!0);
    }
    expect_stdout: true
}

delete_assign_2: {
    options = {
        booleans: true,
        keep_infinity: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        console.log(delete (a = undefined));
        console.log(delete (a = void 0));
        console.log(delete (a = Infinity));
        console.log(delete (a = 1 / 0));
        console.log(delete (a = NaN));
        console.log(delete (a = 0 / 0));
    }
    expect: {
        console.log(!0);
        console.log(!0);
        console.log(!0);
        console.log(!0);
        console.log(!0);
        console.log(!0);
    }
    expect_stdout: true
}

drop_var: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        console.log(a, b);
        var a = 1, b = 2;
        console.log(a, b);
        var a = 3;
        console.log(a, b);
    }
    expect: {
        console.log(a, b);
        var a = 1, b = 2;
        console.log(a, b);
        a = 3;
        console.log(a, b);
    }
    expect_stdout: [
        "undefined undefined",
        "1 2",
        "3 2",
    ]
}

issue_1830_1: {
    options = {
        unused: true,
    }
    input: {
        !function() {
            L: for (var b = console.log(1); !1;) continue L;
        }();
    }
    expect: {
        !function() {
            L: for (console.log(1); !1;) continue L;
        }();
    }
    expect_stdout: "1"
}

issue_1830_2: {
    options = {
        unused: true,
    }
    input: {
        !function() {
            L: for (var a = 1, b = console.log(a); --a;) continue L;
        }();
    }
    expect: {
        !function() {
            var a = 1;
            L: for (console.log(a); --a;) continue L;
        }();
    }
    expect_stdout: "1"
}

issue_1838: {
    options = {
        join_vars: true,
        loops: true,
        unused: true,
    }
    beautify = {
        beautify: true,
    }
    input: {
        function f() {
            var b = a;
            while (c);
        }
    }
    expect_exact: [
        "function f() {",
        "    for (a; c; ) ;",
        "}",
    ]
}

var_catch_toplevel: {
    options = {
        conditionals: true,
        negate_iife: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            a--;
            try {
                a++;
                x();
            } catch(a) {
                if (a) var a;
                var a = 10;
            }
        }
        f();
    }
    expect: {
        !function() {
            0;
            try {
                0;
                x();
            } catch(a) {
                var a;
            }
        }();
    }
}

reassign_const: {
    options = {
        collapse_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f() {
            const a = 1;
            a = 2;
            return a;
        }
        console.log(f());
    }
    expect: {
        function f() {
            const a = 1;
            return a = 2, a;
        }
        console.log(f());
    }
    expect_stdout: true
}

issue_1968: {
    options = {
        unused: true,
    }
    input: {
        function f(c) {
            var a;
            if (c) {
                let b;
                return (a = 2) + (b = 3);
            }
        }
        console.log(f(1));
    }
    expect: {
        function f(c) {
            if (c) {
                let b;
                return 2 + (b = 3);
            }
        }
        console.log(f(1));
    }
    expect_stdout: "5"
}

issue_2063: {
    options = {
        unused: true,
    }
    input: {
        var a;
        var a;
    }
    expect: {
        var a;
    }
}

issue_2105_1: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        !function(factory) {
            factory();
        }( function() {
            return function(fn) {
                fn()().prop();
            }( function() {
                function bar() {
                    var quux = function() {
                        console.log("PASS");
                    }, foo = function() {
                        console.log;
                        quux();
                    };
                    return { prop: foo };
                }
                return bar;
            } );
        });
    }
    expect: {
        ({
            prop: function() {
                console.log;
                console.log("PASS");
            }
        }).prop();
    }
    expect_stdout: "PASS"
}

issue_2105_2: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 3,
        properties: true,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unsafe: true,
        unused: true,
    }
    input: {
        !function(factory) {
            factory();
        }( function() {
            return function(fn) {
                fn()().prop();
            }( function() {
                function bar() {
                    var quux = function() {
                        console.log("PASS");
                    }, foo = function() {
                        console.log;
                        quux();
                    };
                    return { prop: foo };
                }
                return bar;
            } );
        });
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_2136_1: {
    options = {
        inline: true,
        unused: true,
    }
    input: {
        !function(a, ...b) {
            console.log(b);
        }();
    }
    expect: {
        !function(a, ...b) {
            console.log(b);
        }();
    }
    expect_stdout: "[]"
}

issue_2136_2: {
    options = {
        collapse_vars: true,
        inline: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f(x) {
            console.log(x);
        }
        !function(a, ...b) {
            f(b[0]);
        }(1, 2, 3);
    }
    expect: {
        function f(x) {
            console.log(x);
        }
        f([2,3][0]);
    }
    expect_stdout: "2"
}

issue_2136_3: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        function f(x) {
            console.log(x);
        }
        !function(a, ...b) {
            f(b[0]);
        }(1, 2, 3);
    }
    expect: {
        console.log(2);
    }
    expect_stdout: "2"
}

issue_2163: {
    options = {
        pure_funcs: [ "pure" ],
        side_effects: true,
    }
    input: {
        var c;
        /*@__PURE__*/f(...a);
        pure(b, ...c);
    }
    expect: {
        var c;
        a;
        b;
    }
}

issue_2226_1: {
    options = {
        side_effects: true,
        unused: true,
    }
    input: {
        function f1() {
            var a = b;
            a += c;
        }
        function f2(a) {
            a <<= b;
        }
        function f3(a) {
            --a;
        }
        function f4() {
            var a = b;
            return a *= c;
        }
        function f5(a) {
            x(a /= b);
        }
    }
    expect: {
        function f1() {
            b;
            c;
        }
        function f2(a) {
            b;
        }
        function f3(a) {
            0;
        }
        function f4() {
            var a = b;
            return a *= c;
        }
        function f5(a) {
            x(a /= b);
        }
    }
}

issue_2226_2: {
    options = {
        collapse_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        console.log(function(a, b) {
            a += b;
            return a;
        }(1, 2));
    }
    expect: {
        console.log(function(a) {
            return a += 2;
        }(1));
    }
    expect_stdout: "3"
}

issue_2226_3: {
    options = {
        collapse_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        console.log(function(a, b) {
            a += b;
            return a;
        }(1, 2));
    }
    expect: {
        console.log(function(a) {
            return a += 2;
        }(1));
    }
    expect_stdout: "3"
}

issue_2288: {
    options = {
        unused: true,
    }
    beautify = {
        beautify: true,
    }
    input: {
        function foo(o) {
            for (var j = o.a, i = 0; i < 0; i++);
            for (var i = 0; i < 0; i++);
        }
    }
    expect: {
        function foo(o) {
            o.a;
            for (var i = 0; i < 0; i++);
            for (i = 0; i < 0; i++);
        }
    }
}

issue_2516_1: {
    options = {
        collapse_vars: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function foo() {
            function qux(x) {
                bar.call(null, x);
            }
            function bar(x) {
                var FOUR = 4;
                var trouble = x || never_called();
                var value = (FOUR - 1) * trouble;
                console.log(value == 6 ? "PASS" : value);
            }
            Baz = qux;
        }
        var Baz;
        foo();
        Baz(2);
    }
    expect: {
        function foo() {
            function bar(x) {
                var value = (4 - 1) * (x || never_called());
                console.log(value == 6 ? "PASS" : value);
            }
            Baz = function(x) {
                bar.call(null, x);
            };
        }
        var Baz;
        foo();
        Baz(2);
    }
}

issue_2516_2: {
    options = {
        collapse_vars: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function foo() {
            function qux(x) {
                bar.call(null, x);
            }
            function bar(x) {
                var FOUR = 4;
                var trouble = x || never_called();
                var value = (FOUR - 1) * trouble;
                console.log(value == 6 ? "PASS" : value);
            }
            Baz = qux;
        }
        var Baz;
        foo();
        Baz(2);
    }
    expect: {
        function foo() {
            function bar (x) {
                var value = (4 - 1) * (x || never_called());
                console.log(value == 6 ? "PASS" : value);
            }
            Baz = function(x) {
                bar.call(null, x);
            };
        }
        var Baz;
        foo();
        Baz(2);
    }
}

issue_2418_1: {
    options = {
        unused: true,
    }
    input: {
        class C {}
        function F() {}
        (class c {});
        (function f() {});
    }
    expect: {
        class C {}
        function F() {}
        (class {});
        (function() {});
    }
}

issue_2418_2: {
    options = {
        keep_classnames: false,
        keep_fnames: false,
        unused: true,
    }
    input: {
        class C {}
        function F() {}
        (class c {});
        (function f() {});
    }
    expect: {
        class C {}
        function F() {}
        (class {});
        (function() {});
    }
}

issue_2418_3: {
    options = {
        keep_classnames: false,
        keep_fnames: true,
        unused: true,
    }
    input: {
        class C {}
        function F() {}
        (class c {});
        (function f() {});
    }
    expect: {
        class C {}
        function F() {}
        (class {});
        (function f() {});
    }
}

issue_2418_4: {
    options = {
        keep_classnames: true,
        keep_fnames: false,
        unused: true,
    }
    input: {
        class C {}
        function F() {}
        (class c {});
        (function f() {});
    }
    expect: {
        class C {}
        function F() {}
        (class c {});
        (function() {});
    }
}

issue_2418_5: {
    options = {
        keep_classnames: true,
        keep_fnames: true,
        unused: true,
    }
    input: {
        class C {}
        function F() {}
        (class c {});
        (function f() {});
    }
    expect: {
        class C {}
        function F() {}
        (class c {});
        (function f() {});
    }
}

defun_lambda_same_name: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        function f(n) {
            return n ? n * f(n - 1) : 1;
        }
        console.log(function f(n) {
            return n ? n * f(n - 1) : 1;
        }(5));
    }
    expect: {
        console.log(function f(n) {
            return n ? n * f(n - 1) : 1;
        }(5));
    }
    expect_stdout: "120"
}

issue_2660_1: {
    options = {
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = 2;
        function f(b) {
            return b && f() || a--;
        }
        f(1);
        console.log(a);
    }
    expect: {
        var a = 2;
        (function f(b) {
            return b && f() || a--;
        })(1);
        console.log(a);
    }
    expect_stdout: "1"
}

issue_2660_2: {
    options = {
        collapse_vars: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = 1;
        function f(b) {
            b && f();
            --a, a.toString();
        }
        f();
        console.log(a);
    }
    expect: {
        var a = 1;
        (function f(b) {
            b && f(),
            (--a).toString();
        })(),
        console.log(a);
    }
    expect_stdout: "0"
}

issue_2665: {
    options = {
        evaluate: true,
        inline: true,
        keep_fargs: false,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        typeofs: true,
        unused: true,
    }
    input: {
        var a = 1;
        function g() {
            a-- && g();
        }
        typeof h == "function" && h();
        function h() {
            typeof g == "function" && g();
        }
        console.log(a);
    }
    expect: {
        var a = 1;
        function g() {
            a-- && g();
        };
        g();
        console.log(a);
    }
    expect_stdout: "-1"
}

double_assign_1: {
    options = {
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f1() {
            var a = {};
            var a = [];
            return a;
        }
        function f2() {
            var a = {};
            a = [];
            return a;
        }
        function f3() {
            a = {};
            var a = [];
            return a;
        }
        function f4(a) {
            a = {};
            a = [];
            return a;
        }
        function f5(a) {
            var a = {};
            a = [];
            return a;
        }
        function f6(a) {
            a = {};
            var a = [];
            return a;
        }
        console.log(f1(), f2(), f3(), f4(), f5(), f6());
    }
    expect: {
        function f1() {
            return [];
        }
        function f2() {
            var a;
            a = [];
            return a;
        }
        function f3() {
            return [];
        }
        function f4(a) {
            a = [];
            return a;
        }
        function f5(a) {
            a = [];
            return a;
        }
        function f6(a) {
            a = [];
            return a;
        }
        console.log(f1(), f2(), f3(), f4(), f5(), f6());
    }
    expect_stdout: true
}

double_assign_2: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        for (var i = 0; i < 2; i++)
            a = void 0, a = {}, console.log(a);
        var a;
    }
    expect: {
        for (var i = 0; i < 2; i++)
            void 0, a = {}, console.log(a);
        var a;
    }
}

double_assign_3: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        for (var i = 0; i < 2; i++)
            a = void 0, a = { a: a }, console.log(a);
        var a;
    }
    expect: {
        for (var i = 0; i < 2; i++)
            a = void 0, a = { a: a }, console.log(a);
        var a;
    }
}

cascade_drop_assign: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a, b = a = "PASS";
        console.log(b);
    }
    expect: {
        var b = "PASS";
        console.log(b);
    }
    expect_stdout: "PASS"
}

chained_3: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function(a, b) {
            var c = a, c = b;
            b++;
            return c;
        }(1, 2));
    }
    expect: {
        console.log(function(a, b) {
            var c = b;
            b++;
            return c;
        }(0, 2));
    }
    expect_stdout: "2"
}

function_argument_modified_by_function_statement: {
    options = {
        unused: true,
        collapse_vars: true,
    }
    input: {
        var printTest = function(ret) {
            function ret() {
                console.log("PASS");
            }
            return ret;
        }("FAIL");
        printTest();
    }
    expect_stdout: "PASS"
}

issue_2768: {
    options = {
        inline: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "FAIL", c = 1;
        var c = function(b) {
            var d = b = a;
            var e = --b + (d && (a = "PASS"));
        }();
        console.log(a, typeof c);
    }
    expect: {
        var a = "FAIL";
        var c = (d = a, void (d && (a = "PASS")));
        var d;
        console.log(a, typeof c);
    }
    expect_stdout: "PASS undefined"
}

issue_2846: {
    options = {
        collapse_vars: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f(a, b) {
            var a = 0;
            b && b(a);
            return a++;
        }
        var c = f();
        console.log(c);
    }
    expect: {
        var c = function(a, b) {
            a = 0;
            b && b(a);
            return a++;
        }();
        console.log(c);
    }
    expect_stdout: "0"
}

issue_805_1: {
    options = {
        inline: true,
        passes: 2,
        pure_getters: "strict",
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(a) {
            var unused = function() {};
            unused.prototype[a()] = 42;
            (unused.prototype.bar = function() {
                console.log("bar");
            })();
            return unused;
        })(function() {
            console.log("foo");
            return "foo";
        });
    }
    expect_stdout: [
        "foo",
        "bar",
    ]
}

issue_805_2: {
    options = {
        inline: true,
        passes: 2,
        pure_getters: "strict",
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(a) {
            function unused() {}
            unused.prototype[a()] = 42;
            (unused.prototype.bar = function() {
                console.log("bar");
            })();
            return unused;
        })(function() {
            console.log("foo");
            return "foo";
        });
    }
    expect_stdout: [
        "foo",
        "bar",
    ]
}

issue_2995: {
    options = {
        pure_getters: "strict",
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f(a) {
            var b;
            a.b = b = function() {};
            b.c = "PASS";
        }
        var o = {};
        f(o);
        console.log(o.b.c);
    }
    expect: {
        function f(a) {
            var b;
            a.b = b = function() {};
            b.c = "PASS";
        }
        var o = {};
        f(o);
        console.log(o.b.c);
    }
    expect_stdout: "PASS"
}

issue_3146_1: {
    options = {
        collapse_vars: true,
        unused: true,
    }
    input: {
        (function(f) {
            f("g()");
        })(function(a) {
            eval(a);
            function g(b) {
                if (!b) b = "PASS";
                console.log(b);
            }
        });
    }
    expect: {
        (function(f) {
            f("g()");
        })(function(a) {
            eval(a);
            function g(b) {
                if (!b) b = "PASS";
                console.log(b);
            }
        });
    }
    expect_stdout: "PASS"
}

issue_3146_2: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(f) {
            f("g()");
        })(function(a) {
            eval(a);
            function g(b) {
                if (!b) b = "PASS";
                console.log(b);
            }
        });
    }
    expect: {
        (function(f) {
            f("g()");
        })(function(a) {
            eval(a);
            function g(b) {
                if (!b) b = "PASS";
                console.log(b);
            }
        });
    }
    expect_stdout: "PASS"
}

issue_3146_3: {
    options = {
        collapse_vars: true,
        unused: true,
    }
    input: {
        var g = "PASS";
        (function(f) {
            var g = "FAIL";
            f("console.log(g)", g[g]);
        })(function(a) {
            eval(a);
        });
    }
    expect: {
        var g = "PASS";
        (function(f) {
            var g = "FAIL";
            f("console.log(g)", g[g]);
        })(function(a) {
            eval(a);
        });
    }
    expect_stdout: "PASS"
}

issue_3146_4: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        var g = "PASS";
        (function(f) {
            var g = "FAIL";
            f("console.log(g)", g[g]);
        })(function(a) {
            eval(a);
        });
    }
    expect: {
        var g = "PASS";
        (function(f) {
            var g = "FAIL";
            f("console.log(g)", g[g]);
        })(function(a) {
            eval(a);
        });
    }
    expect_stdout: "PASS"
}

issue_3192: {
    options = {
        unused: true,
    }
    input: {
        (function(a) {
            console.log(a = "foo", arguments[0]);
        })("bar");
        (function(a) {
            "use strict";
            console.log(a = "foo", arguments[0]);
        })("bar");
    }
    expect: {
        (function(a) {
            console.log(a = "foo", arguments[0]);
        })("bar");
        (function() {
            "use strict";
            console.log("foo", arguments[0]);
        })("bar");
    }
    expect_stdout: [
        "foo foo",
        "foo bar",
    ]
}

issue_t161_top_retain_1: {
    options = {
        reduce_vars: true,
        top_retain: "f",
        unused: true,
    }
    input: {
        function f() { return 2; }
        function g() { return 3; }
        console.log(f(), g());
    }
    expect: {
        function f() { return 2; }
        console.log(f(), function() {
            return 3;
        }());
    }
    expect_stdout: "2 3"
}

issue_t161_top_retain_2: {
    options = {
        reduce_vars: true,
        top_retain: "f",
        unused: true,
    }
    input: {
        function f() { return 2; }
        function g() { return 3; }
        console.log(f(), f(), g(), g());
    }
    expect: {
        function f() { return 2; }
        function g() { return 3; }
        console.log(f(), f(), g(), g());
    }
    expect_stdout: "2 2 3 3"
}

issue_t161_top_retain_3: {
    options = {
        defaults: true,
        inline: 3,
        passes: 3,
        top_retain: "f",
    }
    input: {
        function f() { return 2; }
        function g() { return 3; }
        console.log(f(), g());
    }
    expect: {
        function f() { return 2; }
        console.log(f(), 3);
    }
    expect_stdout: "2 3"
}

issue_t161_top_retain_4: {
    options = {
        defaults: true,
        inline: 3,
        passes: 3,
        top_retain: "f",
    }
    input: {
        function f() { return 2; }
        function g() { return 3; }
        console.log(f(), f(), g(), g());
    }
    expect: {
        function f() { return 2; }
        console.log(f(), f(), 3, 3);
    }
    expect_stdout: "2 2 3 3"
}

issue_t161_top_retain_5: {
    options = {
        defaults: true,
        inline: 3,
        passes: 3,
        top_retain: "f",
    }
    input: {
        (function() {
            function f() { return 2; }
            function g() { return 3; }
            console.log(f(), g());
        })();
    }
    expect: {
        console.log(2, 3);
    }
    expect_stdout: "2 3"
}

issue_t161_top_retain_6: {
    options = {
        defaults: true,
        inline: 3,
        passes: 3,
        top_retain: "f",
    }
    input: {
        (function() {
            function f() { return 2; }
            function g() { return 3; }
            console.log(f(), f(), g(), g());
        })();
    }
    expect: {
        console.log(2, 2, 3, 3);
    }
    expect_stdout: "2 2 3 3"
}

issue_t161_top_retain_7: {
    options = {
        evaluate: true,
        reduce_vars: true,
        side_effects: true,
        top_retain: "y",
        unused: true,
    }
    input: {
        var x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z);
    }
    expect: {
        var y = 3;
        console.log(2, 3, 4, 6, 8, 12);
    }
    expect_stdout: "2 3 4 6 8 12"
}

issue_t161_top_retain_8: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "y",
    }
    input: {
        function f() { return x; }
        function g() { return y; }
        function h() { return z; }
        var x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h());
    }
    expect: {
        var y = 3;
        console.log(2, 3, 4, 6, 8, 12, 2, 3, 4);
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4"
}

issue_t161_top_retain_9: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "y",
    }
    input: {
        function f() { return x; }
        function g() { return y; }
        function h() { return z; }
        var x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h());
    }
    expect: {
        var y = 3;
        console.log(2, 3, 4, 6, 8, 12, 2, 3, 4);
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4"
}

issue_t161_top_retain_10: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "y,f",
    }
    input: {
        function f() { return x; }
        function g() { return y; }
        function h() { return z; }
        var x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h());
    }
    expect: {
        function f() { return x; }
        var x = 2, y = 3;
        console.log(x, 3, 4, 3 * x, 4 * x, 12, f(), 3, 4);
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4"
}

issue_t161_top_retain_11: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "g,x,y",
    }
    input: {
        function f() { return x; }
        function g() { return y; }
        function h() { return z; }
        var x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h());
    }
    expect: {
        function g() { return y; }
        var x = 2, y = 3;
        console.log(2, y, 4, 2 * y, 8, 4 * y, 2, g(), 4);
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4"
}

issue_t161_top_retain_12: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "g,h",
    }
    input: {
        function f() { return x; }
        function g() { return y; }
        function h() { return z; }
        var x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h());
    }
    expect: {
        function g() { return y; }
        function h() { return z; }
        var y = 3, z = 4;
        console.log(2, y, z, 2 * y, 2 * z, y * z, 2, g(), h());
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4"
}

issue_t161_top_retain_13: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "g",
    }
    input: {
        const f = () => x;
        const g = () => y;
        const h = () => z;
        const x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h());
    }
    expect: {
        const g = () => y, y = 3;
        console.log(2, y, 4, 2 * y, 8, 4 * y, 2, g(), 4);
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4"
}

issue_t161_top_retain_14: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "Alpha,z",
    }
    input: {
        class Alpha {
            num() { return x; }
        }
        class Beta {
            num() { return y; }
        }
        class Carrot {
            num() { return z; }
        }
        function f() { return x; }
        const g = () => y;
        const h = () => z;
        let x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h(),
            (new Alpha).num(), (new Beta).num(), (new Carrot).num());
    }
    expect: {
        class Alpha {
            num() {
                return x;
            }
        }
        let x = 2, z = 4;
        console.log(x, 3, 4, 3 * x, 4 * x, 12, x, 3, 4, new Alpha().num(), new class {
            num() {
                return 3;
            }
        }().num(), new class {
            num() {
                return 4;
            }
        }().num());
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4 2 3 4"
}

issue_t161_top_retain_15: {
    options = {
        defaults: true,
        inline: 3,
        passes: 2,
        top_retain: "Alpha,z",
    }
    mangle = {
        keep_classnames: /^Alpha$/,
        toplevel: true,
    }
    input: {
        class Alpha {
            num() { return x; }
        }
        class Beta {
            num() { return y; }
        }
        class Carrot {
            num() { return z; }
        }
        function f() { return x; }
        const g = () => y;
        const h = () => z;
        let x = 2, y = 3, z = 4;
        console.log(x, y, z, x * y, x * z, y * z, f(), g(), h(),
            (new Alpha).num(), (new Beta).num(), (new Carrot).num());
    }
    expect: {
        class Alpha {
            num() {
                return n;
            }
        }
        let n = 2, u = 4;
        console.log(n, 3, 4, 3 * n, 4 * n, 12, n, 3, 4, new Alpha().num(), new class {
            num() {
                return 3;
            }
        }().num(), new class {
            num() {
                return 4;
            }
        }().num());
    }
    expect_stdout: "2 3 4 6 8 12 2 3 4 2 3 4"
}

issue_t183: {
    options = {
        defaults: true,
        top_retain: [],
    }
    input: {
        function foo(val) {
            function bar(x) {
                if (x) return x;
                bar(x-1);
            }
            return bar(val);
        }
        console.log(foo("PASS"));
    }
    expect: {
        console.log(function bar(x) {
            if (x) return x;
            bar(x - 1);
        }("PASS"));
    }
    expect_stdout: "PASS"
}

unused_seq_elements: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        var a = 0, b = 0;
        console.log("just-make-sure-it-is-compilable") && (a++, b++);
    }
    expect_stdout: "just-make-sure-it-is-compilable"
}

unused_assignments_caused_duplication: {
    options = {
        toplevel: true,
        reduce_vars: true,
        evaluate: true,
        unused: true,
    }
    input: {
        var R, fn = (R = "do not duplicate me", function(){ return useVar(R) });

        leak(fn);
    }
    expect: {
        var fn = function(){ return useVar("do not duplicate me") };

        leak(fn);
    }
}

unused_assignments_caused_duplication_preserve_this: {
    options = {
        toplevel: true,
        reduce_vars: true,
        evaluate: true,
        unused: true,
    }
    input: {
        var R, call = (R = "do preserve `this`", foo.bar)();

        leak(call);
    }
    expect: {
        var call = ("do preserve `this`", foo.bar)();

        leak(call);
    }
}

unused_class_with_static_props_side_effects: {
    options = {
        toplevel: true
    }
    input: {
        let x = "FAIL"
        class X {
           static _ = (x = "PASS")
        }
        console.log(x)
    }
    expect_stdout: "PASS"
}

unused_class_with_static_props_this: {
    options = {
        toplevel: true,
        unused: true
    }
    input: {
        let _classThis;
        var Foo = class {
            static _ = Foo = _classThis = this;
        };
        const x = Foo = _classThis;
        leak(x);
    }
    expect: {
        let _classThis;
        (class {
            static _ = _classThis = this;
        });
        const x = _classThis;
        leak(x);
    }
}

unused_class_with_static_props_this_2: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        let Foo = (()=>{
            let _classThis;
            var Foo = class {
                static _ = (()=>{
                    Foo = _classThis = this;
                })();
                foo(){
                    return "PASS";
                }
            };
            return Foo = _classThis;
        })();
        console.log(new Foo().foo());
    }
    expect: {
        let Foo = (()=>{
            let _classThis;
            (class{static _=(()=>{_classThis=this})();foo(){return "PASS"}});
            return _classThis
        })();
        console.log((new Foo).foo());
    }
    expect_stdout: "PASS"
}

unused_class_with_static_props_side_effects_2: {
    options = {
        toplevel: true
    }
    input: {
        let x = "FAIL"
        function impure() {
            x = "PASS"
        }
        class Unused {
            static _ = impure()
        }
        console.log(x)
    }
    expect_stdout: "PASS"
}

unused_class_which_extends_might_throw: {
    options = {
        toplevel: true
    }
    input: {
        let x = "FAIL"
        try {
            class X extends might_throw_lol() {
                constructor() {}
            }
        } catch(e) {
            x = "PASS"
        }
        console.log(x)
    }
    expect_stdout: "PASS"
}

unused_class_which_might_throw: {
    options = {
        toplevel: true
    }
    input: {
        let x = "FAIL"
        try {
            class X {
                static _ = ima_throw_lol()
            }
        } catch(e) {
            x = "PASS"
        }
        console.log(x)
    }
    expect_stdout: "PASS"
}

unused_class_which_might_throw_2: {
    options = {
        toplevel: true
    }
    input: {
        let x = "FAIL"
        try {
            class X {
                [ima_throw_lol()] = null
            }
        } catch(e) {
            x = "PASS"
        }
        console.log(x)
    }
    expect_stdout: "PASS"
}

unused_class_which_might_throw_3: {
    options = {
        toplevel: true
    }
    input: {
        let x = "FAIL"
        try {
            class X {
                [ima_throw_lol()]() { return null }
            }
        } catch(e) {
            x = "PASS"
        }
        console.log(x)
    }
    expect_stdout: "PASS"
}

unused_class_which_might_throw_4: {
    options = {
        toplevel: true
    }
    input: {
        let x = "FAIL"
        try {
            class X {
                get [ima_throw_lol()]() { return null }
            }
        } catch(e) {
            x = "PASS"
        }
        console.log(x)
    }
    expect_stdout: "PASS"
}

variable_refs_outside_unused_class: {
    options = {
        toplevel: true,
        unused: true
    }
    input: {
        var symbols = id({ prop: 'method' })
        var input = id({ prop: class {} })
        var staticProp = id({ prop: 'foo' })

        class unused extends input.prop {
            static prop = staticProp.prop;

            [symbols.prop]() {
                console.log('PASS')
            }
        }

        console.log("PASS")  // Basically, don't crash
    }

    expect_stdout: "PASS"
}

unused_null_conditional_chain: {
    options = {
        defaults: true,
        sequences: false,
        evaluate: false
    }
    input: {
        null?.unused;
        null?.[side_effect()];
        null?.unused.i_will_throw;
        null?.call(1);
        null?.(2);
        null?.maybe_call?.(3);
    }
    expect: {
    }
}

unused_null_conditional_chain_2: {
    options = {
        toplevel: true,
        defaults: true,
        passes: 5,
    }
    input: {
        let i = 0;
        (i++, null)?.unused;
        (i++, null)?.[side_effect()];
        (i++, null)?.unused.i_will_throw;
        (i++, null)?.call(1);
        (i++, null)?.(2);
        (i++, null)?.maybe_call?.(3);
    }
    expect: {
    }
}

unused_null_conditional_chain_3: {
    options = {
        toplevel: true,
        defaults: true,
        passes: 5,
    }
    input: {
        (side_effect(), null)?.unused;
        (side_effect(), null)?.[side_effect()];
        (side_effect(), null)?.unused.i_will_throw;
        (side_effect(), null)?.call(1);
        (side_effect(), null)?.(2);
        (side_effect(), null)?.maybe_call?.(3);
    }
    expect: {
        // TODO: Elminate everything after ?.
        side_effect(),
            (side_effect(), null)?.[side_effect()],
            (side_effect(), null)?.unused.i_will_throw,
            (side_effect(), null)?.call(1),
            (side_effect(), null)?.(2),
            (side_effect(), null)?.maybe_call?.(3);
    }
}

unused_null_conditional_chain_4: {
    options = {
        toplevel: true,
        defaults: true,
        passes: 5,
    }
    input: {
        function nullish() {
            side_effect();
            return null;
        }
        nullish()?.unused;
        nullish()?.[side_effect()];
        nullish()?.unused.i_will_throw;
        nullish()?.call(1);
        nullish()?.(2);
        nullish()?.maybe_call?.(3);
    }
    expect: {
        // TODO: Elminate everything after ?.
        function nullish() {
            return side_effect(), null;
        }
        nullish(),
            nullish()?.[side_effect()],
            nullish()?.unused.i_will_throw,
            nullish()?.call(1),
            nullish()?.(2),
            nullish()?.maybe_call?.(3);
    }
}

unused_null_conditional_chain_5: {
    options = {
        toplevel: true,
        defaults: true,
        passes: 5,
    }
    input: {
        export const obj = {
            side_effect() {
                side_effect();
                return { null: null };
            }
        }
        obj.side_effect().null?.unused;
        obj.side_effect().null?.[side_effect()];
        obj.side_effect().null?.unused.i_will_throw;
        obj.side_effect().null?.call(1);
        obj.side_effect().null?.(2);
        obj.side_effect().null?.maybe_call?.(3);
    }
    expect: {
        export const obj = {
            side_effect: () => (side_effect(), {null: null})
        }
        // TODO: Elminate everything after ?.
        obj.side_effect().null,
            obj.side_effect().null?.[side_effect()],
            obj.side_effect().null?.unused.i_will_throw,
            obj.side_effect().null?.call(1),
            obj.side_effect().null?.(2),
            obj.side_effect().null?.maybe_call?.(3);
    }
}

issue_t1392: {
    options = { unused: true, side_effects: true };
    input: {
        class RelatedClass {}
        class BaseClass {}
        
        class SubClass extends BaseClass {
            static field = new RelatedClass;
        }

        SubClass
    }
    expect: {
        class RelatedClass {}
        class BaseClass {}
        
        class SubClass extends BaseClass {
            static field = new RelatedClass;
        }
    }
    expect_stdout: true
}

issue_t1392_2: {
    options = { unused: true, side_effects: true };
    input: {
        class BaseClass {}
        class SubClass {
            static {
                new BaseClass()
            }
        }

        SubClass
    }
    expect: {
        class BaseClass {}
        class SubClass {
            static {
                new BaseClass()
            }
        }
    }
    expect_stdout: true
}

issue_t1392_3: {
    options = { unused: true, side_effects: true };
    input: {
        class BaseClass {}
        class SubClass {
            static [new BaseClass()] = 1
        }

        SubClass
    }
    expect: {
        class BaseClass {}
        class SubClass {
            static [new BaseClass()] = 1
        }
    }
    expect_stdout: true
}

issue_t1392_4: {
    options = { unused: true, side_effects: true };
    input: {
        class BaseClass {}
        class SubClass {
            static [new BaseClass()]() {}
        }

        SubClass
    }
    expect: {
        class BaseClass {}
        class SubClass {
            static [new BaseClass()]() {}
        }
    }
    expect_stdout: true
}

issue_t1392_5: {
    options = { unused: true, side_effects: true };
    input: {
        (function test() {
            class RelatedClass {}
            class BaseClass {}
        
            class SubClass extends BaseClass {
              static field = new RelatedClass;
            }
        
            const subclassUser = {
              oneUse: SubClass,
              otherUse() {
                return new SubClass
              }
            };
        })()
    }
    expect: {
        (function(){
            class RelatedClass{}
            class BaseClass{}
            new RelatedClass()
        })();
    }
    expect_stdout: true
}

issue_t1412_1: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        var unused_var;
        class C { static { unused_var = 1234; } }
    }
    expect: { }
}

issue_t1412_2: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        class C { static { side_eff(); } }
    }
    expect: {
        class C { static { side_eff(); } }
    }
}

class_used_within_itself: {
    options = {
        toplevel: true,
        unused: true,
        side_effects: true,
        pure_getters: true,
    };
    input: {
        class C {
            static [C.name] = 1;
        }
    }
    expect: { }
}

class_used_within_itself_2: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        class Class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(this);
        }
    }
    expect: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        class Class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(this);
        }
    }
    expect_stdout: [ 'P', 'A', 'S', 'S' ]
}

class_used_within_itself_3: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            class Wrapper {
                static _ = ((cls) => (_Wrapper = cls))(this);
                render() {
                    ErrorBoundary("foobar");
                }
            }

            return _Wrapper;
        })();

        new cls().render();
    }
    expect: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            class Wrapper {
                static _ = ((cls) => (_Wrapper = cls))(this);
                render() {
                    ErrorBoundary("foobar");
                }
            }

            return _Wrapper;
        })();

        new cls().render();
    }
}

class_used_within_itself_4: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        let c;
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    class r {
                        static #t = (c = n(this, [], e));
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    }
                })();
                x = 1;
                constructor() { }
            })();

        console.log(c.ok);
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS", "true"]
}

class_used_within_itself_5: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        let c;
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    (class {
                        static #t = (c = n(this, [], e));
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    })
                })();
                x = 1;
                constructor() { }
            })();

        console.log(c.ok);
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS", "true"]
}

class_used_within_itself_6: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        class X {
            static prop = "X"
            static Y = class Y extends this { }
        }

        console.log(X.Y.prop)
    }
    expect: {
        class X {
            static prop = "X"
            static Y = class extends this { }
        }

        console.log(X.Y.prop)
    }
    node_version = ">=20.0.0"
    expect_stdout: "X"
}

class_used_within_itself_7: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        class X {
            static prop = "X"
            static Y = class Y extends this { }
        }
    }
    expect: { }
    node_version = ">=20.0.0"
    expect_stdout: true
}

class_used_within_itself_8: {
    options = { toplevel: true, unused: true, side_effects: true, passes: 2 };
    input: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState)

        class RippleRenderer {
            static prop = (this.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        }
    }
    expect: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState)

        class RippleRenderer {
            static prop = (this.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        }
    }
    node_version = ">=20.0.0"
    expect_stdout: true
}

class_used_within_itself_var: {
    options = {
        toplevel: true,
        unused: true,
        side_effects: true,
        pure_getters: true,
    };
    input: {
        var C = class {
            static [C.name] = 1;
        }
    }
    expect: { }
}

class_used_within_itself_2_var: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        var Class = class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(this);
        }
    }
    expect: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        (class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(this);
        });
    }
    expect_stdout: [ 'P', 'A', 'S', 'S' ]
}

class_used_within_itself_3_var: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            var Wrapper = class {
                static _ = ((cls) => (_Wrapper = cls))(Wrapper);
                render() {
                    ErrorBoundary("foobar");
                }
            }

            return _Wrapper;
        })();

        new cls().render();
    }
    expect: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            var Wrapper = class {
                static _ = ((cls) => (_Wrapper = cls))(Wrapper);
                render() {
                    ErrorBoundary("foobar");
                }
            }

            return _Wrapper;
        })();

        new cls().render();
    }
}

class_used_within_itself_4_var: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    var r = class {
                        static #t = n(this, [], e);
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    }
                })();
                x = 1;
                constructor() { }
            })();
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS"]
}

class_used_within_itself_5_var: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        let c;
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    var r = class {
                        static #t = (c = n(this, [], e));
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    }
                })();
                x = 1;
                constructor() { }
            })();

        console.log(c.ok);
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS", "true"]
}

class_used_within_itself_6_var: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        var X = class {
            static prop = "X"
            static Y = class Y extends this { }
        }

        console.log(X.Y.prop)
    }
    expect: {
        var X = class {
            static prop = "X"
            static Y = class extends this { }
        }

        console.log(X.Y.prop)
    }
    node_version = ">=20.0.0"
    expect_stdout: "X"
}

class_used_within_itself_7_var: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        var X = class X {
            static prop = "X"
            static Y = class Y extends this { }
        };
    }
    expect: { }
    node_version = ">=20.0.0"
    expect_stdout: true
}

class_used_within_itself_8_var: {
    options = { toplevel: true, unused: true, side_effects: true, passes: 2 };
    input: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState);

        var RippleRenderer = class RippleRenderer {
            static prop = (this.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        }
    }
    expect: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState);

        (class {
            static prop = (this.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        })
    }
    node_version = ">=20.0.0"
    expect_stdout: true
}

class_used_within_itself_var_expname: {
    options = {
        toplevel: true,
        unused: true,
        side_effects: true,
        pure_getters: true,
    };
    input: {
        var C = class C {
            static [C.name] = 1;
        }
    }
    expect: { }
}

class_used_within_itself_2_var_expname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        var Class = class Class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(Class);
        }
    }
    expect: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        (class Class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(Class);
        });
    }
    expect_stdout: [ 'P', 'A', 'S', 'S' ]
}

class_used_within_itself_3_var_expname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            var Wrapper = class Wrapper {
                static _ = ((cls) => (_Wrapper = cls))(Wrapper);
                render() {
                    ErrorBoundary("foobar");
                }
            }

            return _Wrapper;
        })();

        new cls().render();
    }
    expect: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            (class Wrapper {
                static _ = ((cls) => (_Wrapper = cls))(Wrapper);
                render() {
                    ErrorBoundary("foobar");
                }
            });

            return _Wrapper;
        })();

        new cls().render();
    }
}

class_used_within_itself_4_var_expname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        let c;
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    var r = class r {
                        static #t = (c = n(r, [], e));
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    }
                })();
                x = 1;
                constructor() { }
            })();

        console.log(c.ok);
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS", "true"]
}

class_used_within_itself_5_var_expname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        let c;
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    var r = class r {
                        static #t = (c = n(r, [], e));
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    }
                })();
                x = 1;
                constructor() { }
            })();

        console.log(c.ok);
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS", "true"]
}

class_used_within_itself_6_var_expname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        var X = class X {
            static prop = "X"
            static Y = class Y extends this { }
        }

        console.log(X.Y.prop)
    }
    expect: {
        var X = class {
            static prop = "X"
            static Y = class extends this { }
        }

        console.log(X.Y.prop)
    }
    node_version = ">=20.0.0"
    expect_stdout: "X"
}

class_used_within_itself_7_var_expname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        var X = class X {
            static prop = "X"
            static Y = class Y extends X { }
        }
    }
    expect: { }
    node_version = ">=20.0.0"
    expect_stdout: true
}

class_used_within_itself_8_var_expname: {
    options = { toplevel: true, unused: true, side_effects: true, passes: 2 };
    input: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState);

        var RippleRenderer = class RippleRenderer {
            static prop = (RippleRenderer.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        }
    }
    expect: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState);

        (class RippleRenderer {
            static prop = (RippleRenderer.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        })
    }
    node_version = ">=20.0.0"
    expect_stdout: true
}

class_used_within_itself_classname: {
    options = {
        toplevel: true,
        unused: true,
        side_effects: true,
        pure_getters: true,
    };
    input: {
        class C {
            static [C.name] = 1;
        }
    }
    expect: { }
}

class_used_within_itself_2_classname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        class Class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(Class);
        }
    }
    expect: {
        globalThis.useThis = function(obj) {
            obj.prototype.method()
        }

        const List = ['P', 'A', 'S', 'S'];
        class Class {
            method(t) {
                List.forEach(letter => console.log(letter));
            }
            static prop = useThis(Class);
        };
    }
    expect_stdout: [ 'P', 'A', 'S', 'S' ]
}

class_used_within_itself_3_classname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            class Wrapper {
                static _ = ((cls) => (_Wrapper = cls))(Wrapper);
                render() {
                    ErrorBoundary("foobar");
                }
            }

            return _Wrapper;
        })();

        new cls().render();
    }
    expect: {
        const importedfn = () => console.log("------------");

        const cls = (() => {
            var ErrorBoundary = importedfn;

            let _Wrapper;
            class Wrapper {
                static _ = ((cls) => (_Wrapper = cls))(Wrapper);
                render() {
                    ErrorBoundary("foobar");
                }
            }

            return _Wrapper;
        })();

        new cls().render();
    }
}

class_used_within_itself_4_classname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        let c;
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    class r {
                        static #t = (c = n(r, [], e));
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    }
                })();
                x = 1;
                constructor() { }
            })();

        console.log(c.ok);
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS", "true"]
}

class_used_within_itself_5_classname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        let List = [1];
        let c;
        globalThis.n = t => new t(1);
        (e = [
            ((r = 'x-button'),
            (t, e) => {
                let { addInitializer: n } = e;
                return n(function () {
                    customElements.define(r, this);
                });
            }),
        ]),
            new (class {
                static #t = (() => {
                    class r {
                        static #t = (c = n(r, [], e));
                        constructor(t) {
                            this.ok = List.includes(t);
                            if (this.ok) {
                                console.log("PASS");
                            }
                        }
                    }
                })();
                x = 1;
                constructor() { }
            })();

        console.log(c.ok);
    }
    node_version = ">=20.0.0"
    expect_stdout: ["PASS", "true"]
}

class_used_within_itself_6_classname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        class X {
            static prop = "X"
            static Y = class Y extends X { }
        }

        console.log(X.Y.prop)
    }
    expect: {
        class X {
            static prop = "X"
            static Y = class extends X { }
        }

        console.log(X.Y.prop)
    }
    node_version = ">=20.0.0"
    expect_stdout: "X"
}

class_used_within_itself_7_classname: {
    options = { toplevel: true, unused: true, side_effects: true };
    input: {
        class X {
            static prop = "X"
            static Y = class Y extends X { }
        }
    }
    expect: { }
    node_version = ">=20.0.0"
    expect_stdout: true
}

class_used_within_itself_8_classname: {
    options = { toplevel: true, unused: true, side_effects: true, passes: 2 };
    input: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState);

        class RippleRenderer {
            static prop = (RippleRenderer.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        }
    }
    expect: {
        var RippleState = /* @__PURE__ */ ((RippleState2) => leak(RippleState2))(RippleState);

        class RippleRenderer {
            static prop = (RippleRenderer.sideEffect = sideEffect())

            _onPointerUp = RippleState.VISIBLE
        }
    }
    node_version = ">=20.0.0"
    expect_stdout: true
}

issue_t1447_var: {
    options = { unused: true, inline: true, reduce_vars: true }
    input: {
        var dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
    expect: {
        var dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
}

issue_t1447_const: {
    options = { unused: true, inline: true, reduce_vars: true }
    input: {
        const dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
    expect: {
        const dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
}

issue_t1447_export_var: {
    options = { unused: true, inline: true, reduce_vars: true }
    input: {
        export var dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
    expect: {
        export var dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
}

issue_t1447_export_const: {
    options = { unused: true, inline: true, reduce_vars: true }
    input: {
        export const dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
    expect: {
        export const dropped_func = () => {
            console.log("PASS")
        }

        export const kept_func = () => {
            dropped_func()
        }
    }
}
