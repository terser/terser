using_basic: {
    options = {}
    input: {
        using x = null;
    }
    expect: {
        using x=null;
    }
}

using_multiple: {
    options = {}
    input: {
        using x = f(), y = g(), z = null;
    }
    expect: {
        using x=f(),y=g(),z=null;
    }
}

using_for: {
    options = {}
    input: {
        for (using x = y; ; ) { };
    }
    expect: {
        for(using x = y;;);
    }
}

using_for_in_bad: {
    options = {}
    bad_input: `for (using x in y);`
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid using declaration in for..in loop",
    })
}

using_for_of: {
    options = {}
    input: {
        for (using x of y);
    }
    expect: {
        for(using x of y);
    }
}

using_of_equals_for: {
    options = {}
    input: {
        for (using of = f();;);
    }
    expect: {
        for(using of=f();;);
    }
}

using_with_comments: {
    format = {
        comments: true
    }
    input: {
        /* 1 */using /* 2 */x /* 3 */= /* 4 */f() /* 5 */;
    }
    expect: {
        /* 1 */using/* 2 */x/* 3 */=/* 4 */f()/* 5 */;
    }
}

using_object_pattern_bad: {
    options = {}
    bad_input: `using { x } = y;`
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: punc ({)",
    })
}

using_as_name_asi: {
    options = {}
    input: {
        using
        x = f()
    }
    expect: {
        using;x=f();
    }
}

using_as_name_subscript_expr: {
    options = {}
    input: {
        function f() {
            using[x];
            using.x + using(x) ? using?.x : using`x`;
        }
    }
    expect: {
        function f(){using[x];using.x+using(x)?using?.x:using`x`};
    }
}

using_as_name_in: {
    options = {}
    input: {
        function f() {
            using in foo;
        }
    }
    expect: {
        function f() {
            using in foo;
        }
    }
}

using_as_name_instanceof: {
    options = {}
    input: {
        function f() {
            using instanceof foo;
            using in using instanceof using;
        }
    }
    expect: {
        function f() {
            using instanceof foo;
            using in using instanceof using;
        }
    }
}

using_as_name_for_of: {
    options = {}
    input: {
        for (using of f());
    }
    expect: {
        for(using of f());
    }
}

using_as_name_for_of_of_member_expr: {
    options = {}
    input: {
        for (using of of[property]);
    }
    expect: {
        for(using of of[property]);
    }
}

using_as_name_for_in: {
    options = {}
    input: {
        for (using in f());
        for (using.foo in []);
        for (using().foo in []);
        for (using``.foo in []);
    }
    expect: {
        for(using in f());for(using.foo in []);for(using().foo in []);for(using``.foo in []);
    }
}

await_using_basic: {
    options = {}
    input: {
        async () => { await using x = null; }
    }
    expect: {
        async()=>{await using x=null;}
    }
}

await_using_multiple: {
    options = {}
    input: {
        async () => { await using x = f(), y = g(), z = null; }
    }
    expect: {
        async()=>{await using x=f(),y=g(),z=null;}
    }
}

await_using_escaped_identifier: {
    options = {}
    input: {
        async () => { await using \u0061 = null; }
    }
    expect: {
        async()=>{await using a=null;}
    }
}

await_using_identifier_starts_with_in: {
    options = {}
    input: {
        async () => {
            await using ina = null;
            await using in\u0062 = null;
            await using in𝒞 = null;
        }
    }
    expect: {
        async()=>{await using ina=null;await using inb=null;await using in𝒞=null;}
    }
}

await_using_identifier_starts_with_instanceof: {
    options = {}
    input: {
        async () => {
            await using instanceofa = null;
            await using instanceof\u0062 = null;
            await using instanceof𝒞 = null;
        }
    }
    expect: {
        async()=>{await using instanceofa=null;await using instanceofb=null;await using instanceof𝒞=null;}
    }
}

await_using_object_pattern_bad: {
    options = {}
    bad_input: `async () => { await using { x } = y; }`
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: punc ({)",
    })
}

await_using_for: {
    options = {}
    input: {
        async () => { for (await using x = y; ; ); }
    }
    expect: {
        async()=>{for(await using x=y;;);}
    }
}

await_using_for_in_bad: {
    options = {}
    bad_input: `async () => { for (await using x in y); }`
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid using declaration in for..in loop",
    })
}

await_using_for_of: {
    options = {}
    input: {
        async () => { for (await using x of y); }
    }
    expect: {
        async()=>{for(await using x of y);}
    }
}

await_using_for_await_of: {
    options = {}
    input: {
        async () => { for await (await using x of y); }
    }
    expect: {
        async()=>{for await(await using x of y);}
    }
}

await_using_with_comments: {
    format = {
        comments: true
    }
    input: {
        async () => {/* 1 */await /* 2 */using /* 3 */x /* 4 */= /* 5 */f() /* 6 */}
    }
    expect: {
        async()=>{/* 1 */await/* 2 */using/* 3 */x/* 4 */=/* 5 */f()/* 6 */};
    }
}

await_using_as_name_asi: {
    options = {}
    input: {
        async () => {
            await using
            x = f()
        }
    }
    expect: {
        async()=>{await using;x=f();}
    }
}

await_using_as_name_asi_line_comment: {
    options = {}
    input: {
        async () => {
            await using // comment
            x = f()
        }
    }
    expect: {
        async()=>{await using;x=f();}
    }   
}

await_using_as_name_asi_multiline_comment: {
    options = {}
    input: {
        async () => {
            await using /* comment 
            */ x = f()
        }
    }
    expect: {
        async()=>{await using;x=f();}
    }   
}

await_using_as_name_in: {
    options = {}
    input: {
        async function f() {
            await using in foo;
        }
    }
    expect: {
        async function f() {
            await using in foo;
        }
    }
}

await_using_as_name_instanceof: {
    options = {}
    input: {
        async function f() {
            await using instanceof foo;
        }
    }
    expect: {
        async function f() {
            await using instanceof foo;
        }
    }
}

await_using_as_name_subscript_expr: {
    options = {}
    input: {
        async () => {
            await using[x];
            await using.x + await using(x) ? await using?.x : await using`x`;
        }
    }
    expect: {
        async()=>{await using[x];await using.x+await using(x)?await using?.x:await using`x`};
    }
}

await_using_and_using_in_same_scope: {
    options = {}
    input: {
        async () => {
            await
            z;
            using x
                = f();
            await using y
                = g();
        }
    }
    expect: {
        async()=>{await z;using x=f();await using y=g();}
    }
}

unused_using_should_be_kept: {
    options = {
        unused: true,
    }
    input: {
        using x = f();
    }
    expect: {
        using x=f();
    }
}

unused_await_using_should_be_kept: {
    options = {
        unused: true,
    }
    input: {
        (async () => { await using x = f(); })();
    }
    expect: {
        (async()=>{await using x = f();})();
    }
}

using_is_not_a_simple_statement_with_conditionals: {
    options = {
        sequences: true,
        conditionals: true,
    }
    input: {
        (async (x) => {
            if (x) {
                var xx;
                using x = f();
            } else {
                var yy;
                await using y = g();
            }
        })();
    }
    expect: {
        (async(x)=>{if(x){var xx;using x=f()}else{var yy;await using y=g()}})();
    }
}

using_definition_transformer: {
    options = {
        if_return: true,
    }
    input: {
        using r = ((x) => {
            if (x) {
                return;
            }
            return null;
        })();
    }
    expect: {
        using r=(x=>{if(!x)return null})();
    }
}

using_should_not_merge_flow_with_if_return: {
    options = {
        if_return: true,
    }
    input: {
        (function(x, y) {
            if (x) {
                using x = f();
                return;
            }
        })();
    }
    expect: {
        (function(x,y){if(x){using x=f();return}})();
    }
}

using_should_not_merge_flow_with_conditionals_if_return: {
    options = {
        if_return: true,
        conditionals: true,
        evaluate: true
    }
    input: {
        (function(x, y) {
            if (x) {
                using x = f();
                return;
            }
            if (y) {
                using y = g();
                return y;
            }
        })();
    }
    expect: {
        (function(x,y){if(x){using x=f();return}if(y){using y=g();return y}})();
    }
}

multiple_using_can_be_joined_with_join_vars: {
    options = {
        join_vars: true,
    }
    input: {
        using x = f();
        using y = g();
        using z = null;
    }
    expect: {
        using x=f(),y=g(),z=null;
    }
}

multiple_await_using_can_be_joined_with_join_vars: {
    options = {
        join_vars: true,
    }
    input: {
        async () => {
            await using x = f();
            await using y = g();
            await using z = null;
        }
    }
    expect: {
        async()=>{await using x=f(),y=g(),z=null;}
    }
}

using_should_be_kept_with_defaults_unsafe: {
    options = {
        defaults: true,
        unsafe: true,
    }
    input: {
        const $dispose = Symbol.dispose;
        const fn = () => { console.log("disposed"); }
        using x = { one: 1, [$dispose]: fn };
        console.log(x.one);
    }
    expect: {
        const $dispose = Symbol.dispose,
              fn = () => { console.log("disposed"); };
        using x = { one: 1, [$dispose]: fn };
        console.log(x.one);
    }
}
