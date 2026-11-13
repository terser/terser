only_vars: {
    options = { join_vars: true };
    input: {
        let netmaskBinary = '';
        for (let i = 0; i < netmaskBits; ++i) {
            netmaskBinary += '1';
        }
    }
    expect: {
        let netmaskBinary = '';
        for (let i = 0; i < netmaskBits; ++i) netmaskBinary += '1';
    }
}

issue_1079_with_vars: {
    options = { join_vars: true };
    input: {
        var netmaskBinary = '';
        for (var i = 0; i < netmaskBits; ++i) {
            netmaskBinary += '1';
        }
    }
    expect: {
        for (var netmaskBinary = '', i = 0; i < netmaskBits; ++i) netmaskBinary += '1';
    }
}

issue_1079_with_mixed: {
    options = { join_vars: true };
    input: {
        var netmaskBinary = '';
        for (let i = 0; i < netmaskBits; ++i) {
            netmaskBinary += '1';
        }
    }
    expect: {
        var netmaskBinary = ''
        for (let i = 0; i < netmaskBits; ++i) netmaskBinary += '1';
    }
}

join_vars_lose_other_var: {
    options = {
        defaults: false,
        inline: true,
        reduce_vars: true,
        unused: true,
        side_effects: true,
        join_vars: true,
    }
    input: {
        global.exports = {
            set a(a) {
                console.log(a().get_b())
                const incremented = a()
                incremented.inc_b()
                console.log(incremented.get_b())
            }
        };

        (function (factory) {
            factory(exports)
        })((function (exports) {
            exports.a = function () {
                var b = "PASS",
                    _this = {};
                _this.get_b = function () {
                    return b;
                }
                _this.inc_b = function () {
                    b += "PASS";
                }
                return _this;
            };
        }));
    }
    expect_stdout: [
      "PASS",
      "PASSPASS"
    ]
}

issue_1796_preserve_comments_between_consecutive_decls: {
    options = {
        defaults: true,
        join_vars: true,
    }
    format = {
        comments: /Copyright/,
    }
    input: {
        const a = 1;
        const b = 2;
        /* Copyright 2024 Bar */
        const c = 3;
    }
    expect_exact: [
        "const a=1,b=2,",
        "/* Copyright 2024 Bar */c=3;",
    ]
}

issue_1796_preserve_comments_single_line_input: {
    options = {
        defaults: true,
        join_vars: true,
    }
    format = {
        comments: /Copyright/,
    }
    input: `const a = 1; const b = 2; /* Copyright 2024 Bar */ const c = 3;`
    expect_exact: "const a=1,b=2,/* Copyright 2024 Bar */c=3;"
}

issue_1796_preserve_comments_default_some: {
    options = {
        join_vars: true,
    }
    format = {
        comments: "some",
    }
    input: {
        const a = 1; /* @license A */
        const /* inner */ b = 2; /* @license B */
        const c = 3; /* @copyright C */
    }
    expect_exact: "const a=1,/* @license A */b=2,/* @license B */c=3;/* @copyright C */"
}

issue_1796_preserve_single_line_and_block_trailing_comments: {
    options = {
        join_vars: true,
    }
    format = {
        comments: "all",
    }
    input: {
        function f(obj) {
            const a = 1; // @lic A
            const /* inner */ { b } = obj;
            const c = 3; /* trailing */
        }
    }
    expect_exact: [
        "function f(obj){const a=1,// @lic A",
        "/* inner */{b:b}=obj,c=3;/* trailing */}",
    ]
}

issue_1796_preserve_comments_asi: {
    options = {
        join_vars: true,
    }
    format = {
        comments: "some",
    }
    input: `
        const a = 1
        const b = 2
        /* @license MIT */
        const c = 3
    `
    expect_exact: [
        "const a=1,b=2",
        "/* @license MIT */,c=3;",
    ]
}

issue_1796_preserve_comments_across_eliminated_empty: {
    options = {
        join_vars: true,
    }
    format = {
        comments: "all",
    }
    input: {
        const a = 1; /* c0 */
        ; /* c1 */
        const b = 2; /* c2 */
    }
    expect_exact: "const a=1,/* c0 */ /* c1 */b=2;/* c2 */"
}

issue_1796_preserve_comments_non_adjacent_declarations_only: {
    options = {
        join_vars: true,
    }
    format = {
        comments: "all",
    }
    input: {
        function f() {
            var a = 1;
            while (x()) {
                foo();
            }
            /* @license B */
            var b; /* @license End */
        }
    }
    expect_exact: [
        "function f(){var a=1,",
        "/* @license B */b;while(x())foo();/* @license End */}",
    ]
}

issue_1796_preserve_comments_for_init: {
    options = {
        join_vars: true,
    }
    format = {
        comments: "all",
    }
    input: {
        function f() {
            var a = 1;
            for (/* c1 */ var b = 2 /* c2 */; b < 5; b++) {}
            var x = 1;
            while (g()) {
                foo();
            }
            for (/* c3 */ var y /* c4 */; y < 5; y++) {}
        }
    }
    expect_exact: "function f(){for(var a=1,/* c1 */b=2/* c2 */;b<5;b++);var x=1,/* c3 */y/* c4 */;while(g())foo();for(;y<5;y++);}"
}
