remove_blocks: {
    input: {
        {;}
        foo();
        {};
        {
            {};
        };
        bar();
        {}
    }
    expect: {
        foo();
        bar();
    }
}

keep_some_blocks: {
    input: {
        // 1.
        if (foo) {
            {{{}}}
            if (bar) { baz(); }
            {{}}
        } else {
            stuff();
        }

        // 2.
        if (foo) {
            for (var i = 0; i < 5; ++i)
                if (bar) baz();
        } else {
            stuff();
        }
    }
    expect: {
        // 1.
        if (foo) {
            if (bar) baz();
        } else stuff();

        // 2.
        if (foo) {
            for (var i = 0; i < 5; ++i)
                if (bar) baz();
        } else stuff();
    }
}

issue_1664: {
    input: {
        var a = 1;
        function f() {
            if (undefined) a = 2;
            {
                function undefined() {}
                undefined();
            }
        }
        f();
        console.log(a);
    }
    expect: {
        var a = 1;
        function f() {
            if (undefined) a = 2;
            {
                function undefined() {}
                undefined();
            }
        }
        f();
        console.log(a);
    }
    expect_stdout: "1"
    reminify: false // FIXME - block scoped function
}

issue_1672_for: {
    input: {
        switch (function() {
            return xxx;
        }) {
          case xxx:
            for (; console.log("FAIL");) {
                function xxx() {}
            }
            break;
        }
    }
    expect: {
        switch (function() {
            return xxx;
        }) {
          case xxx:
            for (; console.log("FAIL");) {
                function xxx() {}
            }
            break;
        }
    }
    expect_stdout: true
}

issue_1672_for_strict: {
    input: {
        "use strict";
        switch (function() {
            return xxx;
        }) {
          case xxx:
            for (; console.log("FAIL");) {
                function xxx() {}
            }
            break;
        }
    }
    expect: {
        "use strict";
        switch (function() {
            return xxx;
        }) {
          case xxx:
            for (; console.log("FAIL");) {
                function xxx() {}
            }
            break;
        }
    }
    expect_stdout: true
}

issue_1672_if: {
    input: {
        switch (function() {
            return xxx;
        }) {
          case xxx:
            if (console.log("FAIL")) {
                function xxx() {}
            }
            break;
        }
    }
    expect: {
        switch (function() {
            return xxx;
        }) {
          case xxx:
            if (console.log("FAIL")) function xxx() {}
            break;
        }
    }
    expect_stdout: true
}

issue_1672_if_strict: {
    input: {
        "use strict";
        switch (function() {
            return xxx;
        }) {
          case xxx:
            if (console.log("FAIL")) {
                function xxx() {}
            }
            break;
        }
    }
    expect: {
        "use strict";
        switch (function() {
            return xxx;
        }) {
          case xxx:
            if (console.log("FAIL")) {
                function xxx() {}
            }
            break;
        }
    }
    expect_stdout: true
}

issue_t1155_function_in_block: {
    options = { unused: false }
    mangle = {}
    input: {
        function f1() {
            if ("aaaaaaa") {
                function f2() {
                    return 1;
                }
        
                const var1 = "bbbbbbb";
            }
        }
    }
    expect: {
        function f1() {
            if ("aaaaaaa") {
                function a() {
                    return 1;
                }
        
                const b = "bbbbbbb";
            }
        }
    }
}

issue_t1155_function_in_other_block: {
    options = { unused: false }
    mangle = {}
    input: {
        function f1() {
            if ("aaaaaaaaaannnnnnn") {
                function f2() {
                    return 1;
                }
            }
            if ("aaaaaaaaaannnnnnn") {
                const f2 = "aaaaaaaaaannnnnnn";
            }
        }
    }
    expect: {
        function f1() {
            if ("aaaaaaaaaannnnnnn")
                function a() {
                    return 1;
                }
            if ("aaaaaaaaaannnnnnn") {
                const n = "aaaaaaaaaannnnnnn";
            }
        }
    }
}

issue_2946_else_const: {
    input: {
        if (1) {
            const x = 6;
        } else {
            const y = 12;
        }
        if (2) {
            let z = 24;
        } else {
            let w = 48;
        }
        if (3) {
            class X {}
        } else {
            class Y {}
        }
    }
    expect: {
        if (1) {
            const x = 6;
        } else {
            const y = 12;
        }
        if (2) {
            let z = 24;
        } else {
            let w = 48;
        }
        if (3) {
            class X {}
        } else {
            class Y {}
        }
    }
}
