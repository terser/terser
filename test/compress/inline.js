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
        (function() {
            console.log(new class extends(function(foo_base) {
                return class extends foo_base {};
            }(function(bar_base) {
                return class extends bar_base {};
            }(Array))){}().concat([ "PASS" ])[0]);
        })();
    }
    expect_stdout: "PASS"
    node_version: ">=6"
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
    }
    input: {
        (function() {
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
        })();
    }
    expect: {
        console.log(new class extends(function(foo_base) {
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
        }(1, "PASS", 3).second());
    }
    expect_stdout: "PASS"
    node_version: ">=6"
}
