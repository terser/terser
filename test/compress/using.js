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

using_as_name_member_expr: {
    options = {}
    input: {
        using [ obj ] = f();
    }
    expect: {
        using[obj]=f();
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

await_using_for: {
    options = {}
    input: {
        async () => { for (await using x = y; ; ); }
    }
    expect: {
        async()=>{for(await using x=y;;);}
    }
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

await_using_as_name_member_expr: {
    options = {}
    input: {
        async () => {
            await using [ obj ];
        }
    }
    expect: {
        async()=>{await using[obj];}
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
