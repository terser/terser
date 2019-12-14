inline_within_extends_1: {
    options = {
        evaluate: true,
        inline: 3,
        passes: 1,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            function foo(foo_base) {
                return class extends foo_base {};
            }
            function bar(bar_base) {
                return class extends bar_base {};
            }
            console.log((new class extends (foo(bar(Array))){}).concat(["PASS"])[0]);
        })();
    }
    expect: {
        console.log((new class extends(function(foo_base) {
            return class extends foo_base {};
        }(function(bar_base) {
            return class extends bar_base {};
        }(Array))){}).concat([ "PASS" ])[0]);
    }
    expect_stdout: "PASS"
}

inline_within_extends_2: {
    options = {
        defaults: true,
        evaluate: true,
        inline: 3,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        toplevel: true
    }
    input: {
        class Baz extends(foo(bar(Array))) {
            constructor() {
                super(...arguments);
            }
        }
        function foo(foo_base) {
            return class extends foo_base {
                constructor() {
                    super(...arguments);
                }
                second() {
                    return this[1];
                }
            };
        }
        function bar(bar_base) {
            return class extends bar_base {
                constructor(...args) {
                    super(...args);
                }
            };
        }
        console.log(new Baz(1, "PASS", 3).second());
    }
    expect: {
        class Baz extends(function(foo_base) {
            return class extends foo_base {
                constructor() {
                    super(...arguments);
                }
                second() {
                    return this[1];
                }
            };
        }(function(bar_base) {
            return class extends bar_base {
                constructor(...args) {
                    super(...args);
                }
            };
        }(Array))) {
            constructor() {
                super(...arguments);
            }
        }
        console.log(new Baz(1, "PASS", 3).second());
    }
    expect_stdout: "PASS"
}

issue_308: {
    options = {
        defaults: true,
        passes: 4,
        toplevel: true
    }
    input: {
        exports.withStyles = withStyles;

        function _inherits(superClass) {
            if (typeof superClass !== "function") {
                throw new TypeError("Super expression must be a function, not " + typeof superClass);
            }
            Object.create(superClass);
        }

        function withStyles() {
            var a = EXTERNAL();
            return function(_a) {
                _inherits(_a);
                function d() {}
            }(a);
        }
    }
    expect: {
        exports.withStyles = function () {
            !function (superClass) {
                if ("function" != typeof superClass)
                    throw new TypeError("Super expression must be a function, not " + typeof superClass);
                Object.create(superClass);
            }(EXTERNAL());
        };
    }
}

inline_into_scope_conflict: {
    options = {
        reduce_vars: true,
        inline: true,
        unused: true,
        toplevel: true
    }
    input: {
        global.leak = x => x
        global.modInQuestion = () => console.log("PASS")

        var mod = global.modInQuestion

        const c = function c() {
            mod()
        }

        const b = function b() {
            for (;;) { c(); break }
        }

        ;(function () {
            var mod = leak(mod);
            b();
        })()
    }

    expect_stdout: "PASS"
}

noinline_annotation: {
    options = {
        reduce_vars: true,
        inline: true,
        toplevel: true
    }
    input: {
        function no_inline() {
            return 123;
        }

        /*#__NOINLINE__*/no_inline();
        /*#__NOINLINE__*/no_inline();
    }
    expect: {
        function no_inline() {
            return 123;
        }
        no_inline();
        no_inline();
    }
}

noinline_annotation_2: {
    options = {
        reduce_vars: true,
        inline: true,
        toplevel: true
    }
    input: {
        /*#__NOINLINE__*/
        (() => {
            external()
        })()
    }
    expect: {
        (() => {
            external()
        })()
    }
}

inline_annotation: {
    options = {
        reduce_vars: true,
        inline: true,
        toplevel: true,
        unused: true
    }
    input: {
        function inline() {
            return external();
        }

        /*#__INLINE__*/inline();
        /*#__INLINE__*/inline();
    }
    expect: {
        external();
        external();
    }
}

inline_annotation_2: {
    options = {
        toplevel: true,
        passes: 3,
        defaults: true
    }
    input: {
        const shouldInline = n => +n;

        const a = /*@__INLINE__*/ shouldInline("42.0");
        const b = /*@__INLINE__*/ shouldInline("abc");

        console.log(a, b);
    }
    expect: {
        console.log(42, NaN)
    }
    expect_stdout: "42 NaN"
}
