non_ascii_function_identifier_name: {
    input: {
        function fooλ(δλ) {}
        function λ(δλ) {}
        (function λ(δλ) {})()
    }
    expect_exact: "function fooλ(δλ){}function λ(δλ){}(function λ(δλ){})();"
}

iifes_returning_constants_keep_fargs_true: {
    options = {
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        inline: true,
        join_vars: true,
        keep_fargs: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(){ return -1.23; }());
        console.log( function foo(){ return "okay"; }() );
        console.log( function foo(x, y, z){ return 123; }() );
        console.log( function(x, y, z){ return z; }() );
        console.log( function(x, y, z){ if (x) return y; return z; }(1, 2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3, a(), b()) );
    }
    expect: {
        console.log("okay");
        console.log(123);
        console.log(void 0);
        console.log(2);
        console.log(6);
        console.log((a(), b(), 6));
    }
    expect_stdout: true
}

iifes_returning_constants_keep_fargs_false: {
    options = {
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        inline: true,
        join_vars: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(){ return -1.23; }());
        console.log( function foo(){ return "okay"; }() );
        console.log( function foo(x, y, z){ return 123; }() );
        console.log( function(x, y, z){ return z; }() );
        console.log( function(x, y, z){ if (x) return y; return z; }(1, 2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3, a(), b()) );
    }
    expect: {
        console.log("okay");
        console.log(123);
        console.log(void 0);
        console.log(2);
        console.log(6);
        console.log((a(), b(), 6));
    }
    expect_stdout: true
}

issue_485_crashing_1530: {
    options = {
        conditionals: true,
        dead_code: true,
        evaluate: true,
        inline: true,
        side_effects: true,
    }
    input: {
        (function(a) {
            if (true) return;
            var b = 42;
        })(this);
    }
    expect: {}
}

issue_1841_1: {
    options = {
        keep_fargs: false,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var b = 10;
        !function(arg) {
            for (var key in "hi")
                var n = arg.baz, n = [ b = 42 ];
        }(--b);
        console.log(b);
    }
    expect: {
        var b = 10;
        !function() {
            for (var key in "hi")
                b = 42;
        }(--b);
        console.log(b);
    }
    expect_exact: "42"
}

issue_1841_2: {
    options = {
        keep_fargs: false,
        pure_getters: false,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var b = 10;
        !function(arg) {
            for (var key in "hi")
                var n = arg.baz, n = [ b = 42 ];
        }(--b);
        console.log(b);
    }
    expect: {
        var b = 10;
        !function(arg) {
            for (var key in "hi")
                arg.baz, b = 42;
        }(--b);
        console.log(b);
    }
    expect_exact: "42"
}

function_returning_constant_literal: {
    options = {
        inline: true,
        passes: 2,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function greeter() {
            return { message: 'Hello there' };
        }
        var greeting = greeter();
        console.log(greeting.message);
    }
    expect: {
        console.log("Hello there");
    }
    expect_stdout: "Hello there"
}

hoist_funs: {
    options = {
        hoist_funs: true,
    }
    input: {
        console.log(typeof f, typeof g, 1);
        if (console.log(typeof f, typeof g, 2))
            console.log(typeof f, typeof g, 3);
        else {
            console.log(typeof f, typeof g, 4);
            function f() {}
            console.log(typeof f, typeof g, 5);
        }
        function g() {}
        console.log(typeof f, typeof g, 6);
    }
    expect: {
        function g() {}
        console.log(typeof f, typeof g, 1);
        if (console.log(typeof f, typeof g, 2))
            console.log(typeof f, typeof g, 3);
        else {
            console.log(typeof f, typeof g, 4);
            function f() {}
            console.log(typeof f, typeof g, 5);
        }
        console.log(typeof f, typeof g, 6);
    }
    expect_stdout: [
        "undefined function 1",
        "undefined function 2",
        "function function 4",
        "function function 5",
        "function function 6",
    ]
}

hoist_funs_strict: {
    options = {
        hoist_funs: true,
    }
    input: {
        "use strict";
        console.log(typeof f, typeof g, 1);
        if (console.log(typeof f, typeof g, 2))
            console.log(typeof f, typeof g, 3);
        else {
            console.log(typeof f, typeof g, 4);
            function f() {}
            console.log(typeof f, typeof g, 5);
        }
        function g() {}
        console.log(typeof f, typeof g, 6);
    }
    expect: {
        "use strict";
        function g() {}
        console.log(typeof f, typeof g, 1);
        if (console.log(typeof f, typeof g, 2))
            console.log(typeof f, typeof g, 3);
        else {
            console.log(typeof f, typeof g, 4);
            function f() {}
            console.log(typeof f, typeof g, 5);
        }
        console.log(typeof f, typeof g, 6);
    }
    expect_stdout: [
        "undefined function 1",
        "undefined function 2",
        "function function 4",
        "function function 5",
        "undefined function 6",
    ]
}

scope_funs_strict: {
    mangle = { }
    input: {
        'use strict';
        function x() {
            if (true) {
                let name1 = "nnnnffff"
                function name2() {}
            }
        }
    }
    expect: {
        'use strict';
        function x() {
            if (true) {
                let n = "nnnnffff"
                function f() {}
            }
        }
    }
}

issue_203: {
    options = {
        keep_fargs: false,
        side_effects: true,
        unsafe_Function: true,
        unused: true,
    }
    input: {
        var m = {};
        var fn = Function("require", "module", "exports", "module.exports = 42;");
        fn(null, m, m.exports);
        console.log(m.exports);
    }
    expect: {
        var m = {};
        var fn = Function("n,o", "o.exports=42");
        fn(null, m, m.exports);
        console.log(m.exports);
    }
    expect_stdout: "42"
}

no_webkit: {
    beautify = {
        webkit: false,
    }
    input: {
        console.log(function() {
            1 + 1;
        }.a = 1);
    }
    expect_exact: "console.log(function(){1+1}.a=1);"
    expect_stdout: "1"
}

webkit: {
    beautify = {
        webkit: true,
    }
    input: {
        console.log(function() {
            1 + 1;
        }.a = 1);
    }
    expect_exact: "console.log((function(){1+1}).a=1);"
    expect_stdout: "1"
}

issue_2084: {
    options = {
        collapse_vars: true,
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function() {
            !function(c) {
                c = 1 + c;
                var c = 0;
                function f14(a_1) {
                    if (c = 1 + c, 0 !== 23..toString())
                        c = 1 + c, a_1 && (a_1[0] = 0);
                }
                f14();
            }(-1);
        }();
        console.log(c);
    }
    expect: {
        var c = 0;
        !function (c) {
            c = 1 + c,
                c = 1 + (c = 0),
            0 !== 23..toString() && (c = 1 + c);
        }(-1), console.log(c);
    }
    expect_stdout: "0"
}

issue_2097: {
    options = {
        negate_iife: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            try {
                throw 0;
            } catch (e) {
                console.log(arguments[0]);
            }
        }
        f(1);
    }
    expect: {
        !function() {
            try {
                throw 0;
            } catch (e) {
                console.log(arguments[0]);
            }
        }(1);
    }
    expect_stdout: "1"
}

issue_2101: {
    options = {
        inline: true,
    }
    input: {
        a = {};
        console.log(function() {
            return function() {
                return this.a;
            }();
        }() === function() {
            return a;
        }());
    }
    expect: {
        a = {};
        console.log(function() {
            return this.a;
        }() === a);
    }
    expect_stdout: "true"
}

inner_ref: {
    options = {
        inline: true,
        unused: true,
    }
    input: {
        console.log(function(a) {
            return function() {
                return a + 1;
            }();
        }(1), function(a) {
            return function(a) {
                return a === undefined;
            }();
        }(2));
    }
    expect: {
        console.log(function (a) {
            return a + 1;
        }(1), function (a) {
            return a === void 0;
        }());
    }
    expect_stdout: "2 true"
}

issue_2107: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 3,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function() {
            c++;
        }(c++ + new function() {
            this.a = 0;
            var a = (c = c + 1) + (c = 1 + c);
            return c++ + a;
        }());
        console.log(c);
    }
    expect: {
        var c = 0;
        c++, new function() {
            this.a = 0, c = 1 + (c += 1), c++;
        }(), c++, console.log(c);
    }
    expect_stdout: "5"
}

issue_2114_1: {
    options = {
        collapse_vars: true,
        if_return: true,
        inline: true,
        keep_fargs: false,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function(a) {
            a = 0;
        }([ {
            0: c = c + 1,
            length: c = 1 + c
        }, typeof void function a() {
            var b = function f1(a) {
            }(b && (b.b += (c = c + 1, 0)));
        }() ]);
        console.log(c);
    }
    expect: {
        var c = 0;
        c = 1 + (c += 1), function() {
            var b = void (b && (b.b += (c += 1, 0)));
        }();
        console.log(c);
    }
    expect_stdout: "2"
}

issue_2114_2: {
    options = {
        collapse_vars: true,
        if_return: true,
        inline: true,
        keep_fargs: false,
        passes: 2,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function(a) {
            a = 0;
        }([ {
            0: c = c + 1,
            length: c = 1 + c
        }, typeof void function a() {
            var b = function f1(a) {
            }(b && (b.b += (c = c + 1, 0)));
        }() ]);
        console.log(c);
    }
    expect: {
        var c = 0;
        c = 1 + (c += 1), function() {
            var b = void (b && (b.b += (c += 1, 0)));
        }();
        console.log(c);
    }
    expect_stdout: "2"
}

issue_2428: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 3,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        function bar(k) {
            console.log(k);
        }
        function foo(x) {
            return bar(x);
        }
        function baz(a) {
            foo(a);
        }
        baz(42);
        baz("PASS");
    }
    expect: {
        function baz(a) {
            console.log(a);
        }
        baz(42);
        baz("PASS");
    }
    expect_stdout: [
        "42",
        "PASS",
    ]
}

issue_2531_1: {
    options = {
        evaluate: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function outer() {
            function inner(value) {
                function closure() {
                    return value;
                }
                return function() {
                    return closure();
                };
            }
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        function outer() {
            return value = "Hello", function() {
                return value;
            };
            var value;
        }
        console.log("Greeting:", outer()());
    }
    expect_stdout: "Greeting: Hello"
}

issue_2531_2: {
    options = {
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function outer() {
            function inner(value) {
                function closure() {
                    return value;
                }
                return function() {
                    return closure();
                };
            }
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        function outer() {
            return function() {
                return "Hello";
            };
        }
        console.log("Greeting:", outer()());
    }
    expect_stdout: "Greeting: Hello"
}

issue_2531_3: {
    options = {
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function outer() {
            function inner(value) {
                function closure() {
                    return value;
                }
                return function() {
                    return closure();
                };
            }
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        console.log("Greeting:", "Hello");
    }
    expect_stdout: "Greeting: Hello"
}

empty_body: {
    options = {
        reduce_vars: true,
        side_effects: true,
    }
    input: {
        function f() {
            function noop() {}
            noop();
            return noop;
        }
    }
    expect: {
        function f() {
            function noop() {}
            return noop;
        }
    }
}

inline_loop_1: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            return x();
        }
        for (;;) f();
    }
    expect: {
        function f() {
            return x();
        }
        for (;;) f();
    }
}

inline_loop_2: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        for (;;) f();
        function f() {
            return x();
        }
    }
    expect: {
        for (;;) f();
        function f() {
            return x();
        }
    }
}

inline_loop_3: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var f = function() {
            return x();
        };
        for (;;) f();
    }
    expect: {
        var f = function() {
            return x();
        };
        for (;;) f();
    }
}

inline_loop_4: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        for (;;) f();
        var f = function() {
            return x();
        };
    }
    expect: {
        for (;;) f();
        var f = function() {
            return x();
        };
    }
}

issue_2476: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function foo(x, y, z) {
            return x < y ? x * y + z : x * z - y;
        }
        for (var sum = 0, i = 0; i < 10; i++)
            sum += foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect: {
        function foo(x, y, z) {
            return x < y ? x * y + z : x * z - y;
        }
        for (var sum = 0, i = 0; i < 10; i++)
            sum += foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect_stdout: "465"
}

issue_2601_1: {
    options = {
        inline: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var a = "FAIL";
        (function() {
            function f(b) {
                function g(b) {
                    b && b();
                }
                g();
                (function() {
                    b && (a = "PASS");
                })();
            }
            f("foo");
        })();
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        (function() {
            var b;
            b = "foo",
            function(b) {
                b && b();
            }(),
            b && (a = "PASS");
        })(),
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_2601_2: {
    rename = true
    options = {
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    mangle = {}
    input: {
        var a = "FAIL";
        (function() {
            function f(b) {
                function g(b) {
                    b && b();
                }
                g();
                (function() {
                    b && (a = "PASS");
                })();
            }
            f("foo");
        })();
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        a = "PASS",
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_2604_1: {
    options = {
        inline: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (b) {
                (function f(b) {
                    b && b();
                })();
                b && (a = "PASS");
            }
        })();
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (b) {
                (function(b) {
                    b && b();
                })();
                b && (a = "PASS");
            }
        })();
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_2604_2: {
    rename = true
    options = {
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    mangle = {}
    input: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (b) {
                (function f(b) {
                    b && b();
                })();
                b && (a = "PASS");
            }
        })();
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (o) {
                o && (a = "PASS");
            }
        })();
        console.log(a);
    }
    expect_stdout: "PASS"
}

unsafe_apply_1: {
    options = {
        inline: true,
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        unsafe: true,
        unused: true,
    }
    input: {
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ]);
        (function(a, b) {
            console.log(this, a, b);
        }).apply("foo", [ "bar" ]);
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ], "baz");
    }
    expect: {
        console.log("bar", void 0);
        (function(a, b) {
            console.log(this, a, b);
        }).call("foo", "bar");
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ], "baz");
    }
    expect_stdout: true
}

unsafe_apply_2: {
    options = {
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
    }
    input: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
            console.log(this, a, b);
        }
        (function() {
            foo.apply("foo", [ "bar" ]);
            bar.apply("foo", [ "bar" ]);
        })();
    }
    expect: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
            console.log(this, a, b);
        }
        (function() {
            foo("bar");
            bar.call("foo", "bar");
        })();
    }
    expect_stdout: true
}

unsafe_apply_expansion_1: {
    options = {
        unsafe: true,
    }
    input: {
        console.log.apply(console, [1, ...[2, 3], 4]);
    }
    expect: {
        console.log.call(console, 1, 2, 3, 4);
    }
    expect_stdout: "1 2 3 4"
}

unsafe_apply_expansion_2: {
    options = {
        unsafe: true,
    }
    input: {
        var values = [2, 3];
        console.log.apply(console, [1, ...values, 4]);
    }
    expect: {
        var values = [2, 3];
        console.log.call(console, 1, ...values, 4);
    }
    expect_stdout: "1 2 3 4"
}

unsafe_call_1: {
    options = {
        inline: true,
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        unsafe: true,
        unused: true,
    }
    input: {
        (function(a, b) {
            console.log(a, b);
        }).call("foo", "bar");
        (function(a, b) {
            console.log(this, a, b);
        }).call("foo", "bar");
    }
    expect: {
        console.log("bar", void 0);
        (function(a, b) {
            console.log(this, a, b);
        }).call("foo", "bar");
    }
    expect_stdout: true
}

unsafe_call_2: {
    options = {
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
    }
    input: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
            console.log(this, a, b);
        }
        (function() {
            foo.call("foo", "bar");
            bar.call("foo", "bar");
        })();
    }
    expect: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
            console.log(this, a, b);
        }
        (function() {
            foo("bar");
            bar.call("foo", "bar");
        })();
    }
    expect_stdout: true
}

unsafe_call_3: {
    options = {
        side_effects: true,
        unsafe: true,
    }
    input: {
        console.log(function() {
            return arguments[0] + eval("arguments")[1];
        }.call(0, 1, 2));
    }
    expect: {
        console.log(function() {
            return arguments[0] + eval("arguments")[1];
        }(1, 2));
    }
    expect_stdout: "3"
}

unsafe_call_expansion_1: {
    options = {
        unsafe: true,
    }
    input: {
        (function(...a) {
            console.log(...a);
        }).call(console, 1, ...[2, 3], 4);
    }
    expect: {
        console,
        (function(...a) {
            console.log(...a);
        })(1, 2, 3, 4);
    }
    expect_stdout: "1 2 3 4"
}

unsafe_call_expansion_2: {
    options = {
        unsafe: true,
    }
    input: {
        var values = [2, 3];
        (function(...a) {
            console.log(...a);
        }).call(console, 1, ...values, 4);
    }
    expect: {
        var values = [2, 3];
        console,
        (function(...a) {
            console.log(...a);
        })(1, ...values, 4);
    }
    expect_stdout: "1 2 3 4"
}

issue_2616: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f() {
                function g(NaN) {
                    (true << NaN) - 0/0 || (c = "PASS");
                }
                g([]);
            }
            f();
        })();
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        !function (NaN) {
            (true << NaN) - 0 / 0 || (c = "PASS");
        }([]);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_1: {
    options = {
        inline: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f(a) {
                var b = function g(a) {
                    a && a();
                }();
                if (a) {
                    var d = c = "PASS";
                }
            }
            f(1);
        })();
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        !function (a) {
            if (function (a) {
                a && a();
            }(), a) c = "PASS";
        }(1), console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_2: {
    options = {
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f(a) {
                var b = function g(a) {
                    a && a();
                }();
                if (a) {
                    var d = c = "PASS";
                }
            }
            f(1);
        })();
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        c = "PASS",
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_3: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f(a, NaN) {
                function g() {
                    switch (a) {
                      case a:
                        break;
                      case c = "PASS", NaN:
                        break;
                    }
                }
                g();
            }
            f(0/0);
        })();
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        !function (a, NaN) {
            (function () {
                switch (a) {
                    case a:
                        break;
                    case c = "PASS", NaN:
                        break;
                }
            })();
        }(NaN);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_4: {
    rename = true,
    options = {
        dead_code: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f(a, NaN) {
                function g() {
                    switch (a) {
                      case a:
                        break;
                      case c = "PASS", NaN:
                        break;
                    }
                }
                g();
            }
            f(0/0);
        })();
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        !function() {
            if (NaN === void (c = "PASS"));
        }();
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2630_1: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        (function() {
            while (f());
            function f() {
                var a = function() {
                    var b = c++, d = c = 1 + c;
                }();
            }
        })();
        console.log(c);
    }
    expect: {
        var c = 0;
        (function() {
            while (f());
            function f() {
                c = 1 + ++c;
            }
        })(),
        console.log(c);
    }
    expect_stdout: "2"
}

issue_2630_2: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function() {
            while (f()) {}
            function f() {
                var not_used = function() {
                    c = 1 + c;
                }(c = c + 1);
            }
        }();
        console.log(c);
    }
    expect: {
        var c = 0;
        !function() {
            while (f());
            function f() {
                c = 1 + (c += 1);
            }
        }(), console.log(c);
    }
    expect_stdout: "2"
}

issue_2630_3: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var x = 2, a = 1;
        (function() {
            function f1(a) {
                f2();
                --x >= 0 && f1({});
            }
            f1(a++);
            function f2() {
                a++;
            }
        })();
        console.log(a);
    }
    expect: {
        var x = 2, a = 1;
        (function() {
            (function f1(a) {
                f2();
                --x >= 0 && f1({});
            })(a++);
            function f2() {
                a++;
            }
        })();
        console.log(a);
    }
    expect_stdout: "5"
}

issue_2630_4: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var x = 3, a = 1, b = 2;
        (function() {
            (function f1() {
                while (--x >= 0 && f2());
            }());
            function f2() {
                a++ + (b += a);
            }
        })();
        console.log(a);
    }
    expect: {
        var x = 3, a = 1, b = 2;
        (function() {
            (function() {
                while(--x >= 0 && f2());
            })();
            function f2(){a++,b+=a}
        })();
        console.log(a);
    }
    expect_stdout: "2"
}

issue_2630_5: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var c = 1;
        !function() {
            do {
                c *= 10;
            } while (f());
            function f() {
                return function() {
                    return (c = 2 + c) < 100;
                }(c = c + 3);
            }
        }();
        console.log(c);
    }
    expect: {
        var c = 1;
        !function() {
            do {
                c *= 10;
            } while (f());
            function f() {
                return (c = 2 + (c += 3)) < 100;
            }
        }();
        console.log(c);
    }
    expect_stdout: "155"
}

issue_2647_1: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(n, o = "FAIL") {
            console.log(n);
        })("PASS");
        (function(n, o = "PASS") {
            console.log(o);
        })("FAIL");
        (function(o = "PASS") {
            console.log(o);
        })();
        (function(n, {o = "FAIL"}) {
            console.log(n);
        })("PASS", {});
    }
    expect_stdout: [
        "PASS",
        "PASS",
        "PASS",
        "PASS",
    ]
}

issue_2647_2: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            function foo(x) {
                return x.toUpperCase();
            }
            console.log((() => foo("pass"))());
        }());
    }
    expect: {
        void console.log("pass".toUpperCase());
    }
    expect_stdout: "PASS"
}

issue_2647_3: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            function foo(x) {
                return x.toUpperCase();
            }
            console.log((() => {
                return foo("pass");
            })());
        }());
    }
    expect: {
        void console.log("pass".toUpperCase());
    }
    expect_stdout: "PASS"
}

recursive_inline_1: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            h();
        }
        function g(a) {
            a();
        }
        function h(b) {
            g();
            if (b) x();
        }
    }
    expect: {}
}

recursive_inline_2: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f(n) {
            return n ? n * f(n - 1) : 1;
        }
        console.log(f(5));
    }
    expect: {
        console.log(function f(n) {
            return n ? n * f(n - 1) : 1;
        }(5));
    }
    expect_stdout: "120"
}

issue_2657: {
    options = {
        inline: true,
        reduce_vars: true,
        sequences: true,
        passes: 2,
        unused: true,
    }
    input: {
        "use strict";
        console.log(function f() {
            return h;
            function g(b) {
                return b || b();
            }
            function h(a) {
                g(a);
                return a;
            }
        }()(42));
    }
    expect: {
        "use strict";
        console.log(function(a) {
            return b = a, b || b(), a;
            var b;
        }(42));
    }
    expect_stdout: "42"
}

issue_2663_1: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            var i, o = {};
            function createFn(j) {
                return function() {
                    console.log(j);
                };
            }
            for (i in { a: 1, b: 2, c: 3 })
                o[i] = createFn(i);
            for (i in o)
                o[i]();
        })();
    }
    expect: {
        (function() {
            var i, o = {};
            function createFn(j) {
                return function() {
                    console.log(j);
                };
            }
            for (i in { a: 1, b: 2, c: 3 })
                o[i] = createFn(i);
            for (i in o)
                o[i]();
        })();
    }
    expect_stdout: [
        "a",
        "b",
        "c",
    ]
}

issue_2663_2: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            var i;
            function fn(j) {
                return function() {
                    console.log(j);
                }();
            }
            for (i in { a: 1, b: 2, c: 3 })
                fn(i);
        })();
    }
    expect: {
        (function() {
            var i;
            function fn(j) {
                return void console.log(j);
            }
            for (i in { a: 1, b: 2, c: 3 })
                fn(i);
        })();
    }
    expect_stdout: [
        "a",
        "b",
        "c",
    ]
}

issue_2663_3: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            var outputs = [
                { type: 0, target: null, eventName: "ngSubmit", propName: null },
                { type: 0, target: null, eventName: "submit", propName: null },
                { type: 0, target: null, eventName: "reset", propName: null },
            ];
            function listenToElementOutputs(outputs) {
                var handlers = [];
                for (var i = 0; i < outputs.length; i++) {
                    var output = outputs[i];
                    var handleEventClosure = renderEventHandlerClosure(output.eventName);
                    handlers.push(handleEventClosure)
                }
                var target, name;
                return handlers;
            }
            function renderEventHandlerClosure(eventName) {
                return function () {
                    return console.log(eventName);
                };
            }
            listenToElementOutputs(outputs).forEach(function (handler) {
                return handler()
            });
        })();
    }
    expect: {
        (function() {
            function renderEventHandlerClosure(eventName) {
                return function() {
                    return console.log(eventName);
                };
            }
            (function(outputs) {
                var handlers = [];
                for (var i = 0; i < outputs.length; i++) {
                    var output = outputs[i];
                    var handleEventClosure = renderEventHandlerClosure(output.eventName);
                    handlers.push(handleEventClosure);
                }
                return handlers;
            })([ {
                type: 0,
                target: null,
                eventName: "ngSubmit",
                propName: null
            }, {
                type: 0,
                target: null,
                eventName: "submit",
                propName: null
            }, {
                type: 0,
                target: null,
                eventName: "reset",
                propName: null
            } ]).forEach(function(handler) {
                return handler();
            });
        })();
    }
    expect_stdout: [
        "ngSubmit",
        "submit",
        "reset",
    ]
}

duplicate_argnames: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "PASS";
        function f(b, b, b) {
            b && (a = "FAIL");
        }
        f(0, console);
        console.log(a);
    }
    expect: {
        var a = "PASS";
        console, b && (a = "FAIL");
        var b;
        console.log(a);
    }
    expect_stdout: "PASS"
}

loop_init_arg: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        var a = "PASS";
        for (var k in "12") (function (b) {
            (b >>= 1) && (a = "FAIL"), b = 2;
        })();
        console.log(a);
    }
    expect_stdout: "PASS"
}

inline_false: {
    options = {
        inline: false,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_0: {
    options = {
        inline: 0,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_1: {
    options = {
        inline: 1,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        console.log(1);
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_2: {
    options = {
        inline: 2,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        console.log(1);
        a = 2, console.log(a);
        var a;
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_3: {
    options = {
        inline: 3,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        console.log(1);
        a = 2, console.log(a);
        var a;
        b = 3, c = b, console.log(c);
        var b, c;
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_true: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        console.log(1);
        a = 2, console.log(a);
        var a;
        b = 3, c = b, console.log(c);
        var b, c;
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

issue_2842: {
    options = {
        side_effects: true,
        reduce_vars: true,
        reduce_funcs: true,
        unused: true,
    }
    input: {
        (function() {
            function inlinedFunction(data) {
                return data[data[0]];
            }
            function testMinify() {
                if (true) {
                    const data = inlinedFunction([1, 2, 3]);
                    console.log(data);
                }
            }
            return testMinify();
        })();
    }
    expect: {
        (function () {
            (function () {
                if (true) {
                    const data = function (data) {
                        return data[data[0]];
                    }([1, 2, 3]);
                    console.log(data);
                }
            })();
        })();
    }
    expect_stdout: [
        "2"
    ]
}

use_before_init_in_loop: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        var a = "PASS";
        for (var b = 2; --b >= 0;) (function() {
            var c = function() {
                return 1;
            }(c && (a = "FAIL"));
        })();
        console.log(a);
    }
    expect: {
        var a = "PASS";
        for (var b = 2; --b >= 0;) (function() {
            var c = (c && (a = "FAIL"), 1);
        })();
        console.log(a);
    }
    expect_stdout: "PASS"
}

duplicate_arg_var: {
    options = {
        inline: true,
        toplevel: true,
    }
    input: {
        console.log(function(b) {
            return b + "ING";
            var b;
        }("PASS"));
    }
    expect: {
        console.log((b = "PASS", b + "ING"));
        var b;
    }
    expect_stdout: "PASSING"
}

issue_2737_1: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(a) {
            while (a());
        })(function f() {
            console.log(typeof f);
        });
    }
    expect: {
        (function(a) {
            while (a());
        })(function f() {
            console.log(typeof f);
        });
    }
    expect_stdout: "function"
}

issue_2737_2: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(bar) {
            for (;bar(); ) break;
        })(function qux() {
            return console.log("PASS"), qux;
        });
    }
    expect: {
        (function(bar) {
            for (;bar(); ) break;
        })(function qux() {
            return console.log("PASS"), qux;
        });
    }
    expect_stdout: "PASS"
}

issue_2783: {
    options = {
        collapse_vars: true,
        conditionals: true,
        if_return: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            return g;
            function f(a) {
                var b = a.b;
                if (b) return b;
                return a;
            }
            function g(o, i) {
                while (i--) {
                    console.log(f(o));
                }
            }
        })()({ b: "PASS" }, 1);
    }
    expect: {
        (function() {
            return function(o,i) {
                while (i--) console.log(f(o));
            };
            function f(a) {
                var b = a.b;
                return b || a;
            }
        })()({ b: "PASS" },1);
    }
    expect_stdout: "PASS"
}

inline_function_expressions: {
    options = {
        inline: 2
    }
    input: {
        (async()=>2)().catch(x=>null);
        (async function(){ return 3; })().catch(x => null);
        (() => 4)();
        (function(){ return 5; })();
        (function*(){ return 6; })();
    }
    expect: {
        (async()=>2)().catch(x=>null);
        (async function(){return 3})().catch(x=>null);
        4;
        5;
        (function*(){return 6})();
    }
}

issue_2898: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        sequences: true,
        unused: true,
    }
    input: {
        var c = 0;
        (function() {
            while (f());
            function f() {
                var b = (c = 1 + c, void (c = 1 + c));
                b && b[0];
            }
        })();
        console.log(c);
    }
    expect_stdout: "2"
}

deduplicate_parenthesis: {
    input: {
        ({}).a = b;
        (({}).a = b)();
        (function() {}).a = b;
        ((function() {}).a = b)();
    }
    expect_exact: "({}).a=b;({}.a=b)();(function(){}).a=b;(function(){}.a=b)();"
}

issue_3166: {
    options = {
        directives: true,
    }
    input: {
        "foo";
        "use strict";
        function f() {
            "use strict";
            "bar";
            "use asm";
        }
    }
    expect: {
        "use strict";
        function f() {
            "use asm";
        }
    }
}

issue_3016_1: {
    options = {
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            (function(a) {
                return a[b];
                var a;
            })(3);
        } while (0);
        console.log(b);
    }
    expect: {
        var b = 1;
        do {
            (function(a) {
                return a[b];
                var a;
            })(3);
        } while(0);
        console.log(b);
    }
    expect_stdout: "1"
}

issue_3016_2: {
    options = {
        dead_code: true,
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            (function(a) {
                return a[b];
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            })(3);
        } while (0);
        console.log(b);
    }
    expect: {
        var b = 1;
        do {
            (function(a){
                return a[b];
                var a;
            })(3);
        } while(0);
        console.log(b);
    }
    expect_stdout: "1"
}

issue_3016_2_ie8: {
    options = {
        dead_code: true,
        ie8: true,
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            (function(a) {
                return a[b];
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            })(3);
        } while (0);
        console.log(b);
    }
    expect: {
        var b = 1;
        do {
            (function(a){
                return a[b];
                var a;
            })(3);
        } while(0);
        console.log(b);
    }
    expect_stdout: "1"
}

issue_3016_3: {
    options = {
        dead_code: true,
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            console.log(function() {
                return a ? "FAIL" : a = "PASS";
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            }());
        } while (b--);
    }
    expect_stdout: [
        "PASS",
        "PASS",
    ]
}

issue_3016_3_ie8: {
    options = {
        dead_code: true,
        ie8: true,
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            console.log(function() {
                return a ? "FAIL" : a = "PASS";
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            }());
        } while (b--);
    }
    expect_stdout: [
        "PASS",
        "PASS",
    ]
}

issue_3018: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        var b = 1, c = "PASS";
        do {
            (function() {
                (function(a) {
                    a = 0 != (a && (c = "FAIL"));
                })();
            })();
        } while (b--);
        console.log(c);
    }
    expect: {
        var b = 1, c = "PASS";
        do {
            (function() {
                a = 0 != (a && (c = "FAIL"));
                var a;
            })();
        } while (b--);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_3054: {
    options = {
        booleans: true,
        collapse_vars: true,
        inline: 1,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        "use strict";
        function f() {
            return { a: true };
        }
        console.log(function(b) {
            b = false;
            return f();
        }().a, f.call().a);
    }
    expect_stdout: "true true"
}

issue_3076: {
    options = {
        dead_code: true,
        inline: true,
        sequences: true,
        unused: true,
    }
    input: {
        var c = "PASS";
        (function(b) {
            var n = 2;
            while (--b + function() {
                e && (c = "FAIL");
                e = 5;
                return 1;
                try {
                    var a = 5;
                } catch (e) {
                    var e;
                }
            }().toString() && --n > 0);
        })(2);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_3125: {
    options = {
        inline: true,
        unsafe: true,
    }
    input: {
        console.log(function() {
            return "PASS";
        }.call());
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

drop_lone_use_strict: {
    options = {
        directives: true,
        side_effects: true,
    }
    input: {
        function f1() {
            "use strict";
        }
        function f2() {
            "use strict";
            function f3() {
                "use strict";
            }
        }
        (function f4() {
            "use strict";
        })();
    }
    expect: {
        function f1() {
        }
        function f2() {
            "use strict";
            function f3() {
            }
        }
    }
}

drop_lone_use_strict_arrows_1: {
    options = {
        side_effects: true,
        directives: true,
    }
    input: {
        var f0 = () => 0;
        var f1 = () => {
            "use strict";
        }
        var f2 = () => {
            "use strict";
            var f3 = () => {
                "use strict";
            }
        }
        (() => {
            "use strict";
        })();
    }
    expect: {
        var f0 = () => 0;
        var f1 = () => {};
        var f2 = () => {
            "use strict";
            var f3 = () => {};
        };
    }
}

drop_lone_use_strict_arrows_2: {
    options = {
        dead_code: true,
        passes: 2,
        side_effects: true,
        unused: true,
    }
    input: {
        let f0 = () => 0;
        let f1 = () => {
            "use strict";
        }
        let f2 = () => {
            "use strict";
            let f3 = () => {
                "use strict";
            }
        }
        (() => {
            "use strict";
            return undefined;
        })();
    }
    expect: {
        let f0 = () => 0;
        let f1 = () => {};
        let f2 = () => {};
    }
}

issue_t131a: {
    options = {
        inline: 1,
        join_vars: true,
        reduce_vars: true,
        side_effects: true,
        passes: 2,
        unused: true,
    }
    input: {
        (function() {
            function thing() {
                return {
                    a: 1,
                };
            }
            function one() {
                return thing();
            }
            function two() {
                var x = thing();
                x.a = 2;
                x.b = 3;
                return x;
            }
            console.log(JSON.stringify(one()), JSON.stringify(two()));
        })();
    }
    expect: {
        console.log(JSON.stringify({
            a: 1
        }), JSON.stringify({
            a: 2,
            b: 3
        }));

    }
    expect_stdout: '{"a":1} {"a":2,"b":3}'
}

issue_t131b: {
    options = {
        defaults: true,
        passes: 2,
    }
    input: {
        (function() {
            function thing() {
                return {
                    a: 1,
                };
            }
            function one() {
                return thing();
            }
            function two() {
                var x = thing();
                x.a = 2;
                x.b = 3;
                return x;
            }
            console.log(JSON.stringify(one()), JSON.stringify(two()));
        })();
    }
    expect: {
        console.log(JSON.stringify({
            a: 1
        }), JSON.stringify({
            a: 2,
            b: 3
        }));
    }
    expect_stdout: '{"a":1} {"a":2,"b":3}'
}

avoid_generating_duplicate_functions_compared_together: {
    options = {
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const x = () => null;
        const y = () => x;
        console.log(y() === y());
    }
    expect_stdout: "true"
}

avoid_generating_duplicate_functions_compared_together_2: {
    options = {
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const defaultArg = input => input;
        const fn = (arg = defaultArg) => arg;
        console.log(fn() === fn());
    }
    expect_stdout: "true"
}

avoid_generating_duplicate_functions_compared_together_3: {
    options = {
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const x = () => null;
        console.log(id(x) === id(x));
    }
    expect_stdout: "true"
}

avoid_generating_duplicate_functions_compared_together_4: {
    options = {
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const x = () => null;
        const y = () => x;
        const fns = [y(), y()]
        console.log(fns[0] === fns[1]);
        const fns_obj = {a: y(), b: y()}
        console.log(fns_obj.a === fns_obj.b);
    }
    expect_stdout: ["true", "true"]
}
