issue_t1371: {
    options = {
    }
    input: {
        (foo?.bar()).baz = true;
        ((foo?.bar())).baz = true;
        (foo?.bar)();
        (foo?.bar).baz;
        new (foo?.bar)();
        (foo?.())();
        (foo?.()).bar;
        new (foo?.())();        
        
        (foo?.bar());
        (foo?.bar) + 42;
        (foo?.bar), 42;
    }
    expect: {
        (foo?.bar()).baz = true;
        (foo?.bar()).baz = true;
        (foo?.bar)();
        (foo?.bar).baz;
        new (foo?.bar)();
        (foo?.())();
        (foo?.()).bar;
        new (foo?.())();        

        foo?.bar();
        foo?.bar + 42;
        foo?.bar, 42;
    }
}

issue_t1371_call_parentheses: {
    options = {
    }
    input: {
        (function(o) {
            console.log(o.f("FAIL"), (o.f)("FAIL"), (0, o.f)(42));
            console.log(o?.f("FAIL"), (o?.f)("FAIL"), (0, o?.f)(42));
        })({
            a: "PASS",
            f(b) {
                return this.a || b;
            },
        });
    }
    expect_exact: '(function(o){console.log(o.f("FAIL"),o.f("FAIL"),(0,o.f)(42));console.log(o?.f("FAIL"),(o?.f)("FAIL"),(0,o?.f)(42))})({a:"PASS",f(b){return this.a||b}});'
    expect_stdout: [
        "PASS PASS 42",
        "PASS PASS 42",
    ]
}
