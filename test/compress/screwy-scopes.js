
// JS scopes are tricky.
// Function argnames have their own private scope, so it's possible to refer to a name that's redefined both in and outside the function.
// Must we support this? Not really. It would be tough to do and change a lot of assumptions the compiler relies on.
// Instead we detect and then opt out of optimization for these rare cases.

// https://github.com/mishoo/UglifyJS/issues/2662
// https://github.com/terser/terser/issues/1478
// https://github.com/terser/terser/issues/91

screwy_scope_1: {
    input: {
        console.log(
            function(x, f = () => x) {
                var x;
                x = "FAIL";
                return f();
            }("PASS")
        );
    }
    expect_stdout: "PASS"
}

screwy_scope_2: {
    input: {
        console.log(
            function(x, f = () => x) {
                x = "PASS";
                return f();
            }("FAIL")
        );
    }
    input: {
        console.log(
            function(x, f = () => x) {
                x = "PASS";
                return f();
            }("FAIL")
        );
    }
    expect_stdout: "PASS"
}

screwy_scope_3: {
    input: {
        const exp = (t) => "PASS";
        function smoothDamp(easing = exp) {
            const exp = easing(10);
            return exp
        }
        console.log(smoothDamp())
    }
    expect_stdout: "PASS"
}

screwy_scope_4: {
    input: {
        var exp = (t) => "PASS";
        function smoothDamp(easing = exp) {
            var exp = easing(10);
            return exp
        }
        console.log(smoothDamp())
    }
    expect_stdout: "PASS"
}

screwy_scope_5: {
    input: {
        const exp = (t) => "PASS";
        {
            function smoothDamp(easing = exp) {
                const exp = easing(10);
                return exp
            }
            console.log(smoothDamp())
        }
    }
    expect_stdout: "PASS"
}

screwy_scope_6: {
    input: {
        var exp = (t) => "PASS";
        function smoothDamp(easing = exp) {
            const exp = easing(10);
            return exp
        }
        console.log(smoothDamp())
    }
    expect_stdout: "PASS"
}

screwy_scope_7: {
    mangle = true
    input: {
        var exp = (t) => "PASS";
        {
            function smoothDamp(easing = exp) {
                const exp = easing(10);
                return exp
            }
            console.log(smoothDamp())
        }
    }
    expect_stdout: "PASS"
}

screwy_scope_ensemble: {
    options = {
        toplevel: true,
    }
    mangle = true
    input: {
        const outer = 1;

        console.log(((outer, foo = outer) => { return foo })()); // undefined
        console.log(((foo = outer) => { return foo })()); // 1
        console.log(((foo = outer) => { var outer; return foo })()); // 1
        console.log(((foo = outer) => { let outer; return foo })()); // 1
        console.log(((outer, { [outer]: foo }) => { return foo })('key', { key: 2 })); // 2
        console.log(((outer, { [outer]: foo }) => { var outer; return foo })('key', { key: 2 })); // 2
        console.log((({ [outer]: foo }) => { return foo })({ 1: 2 })); // 2
        console.log((({ [outer]: foo }) => { var outer; return foo })({ 1: 2 })); // 2
        console.log((({ [outer]: foo }) => { let outer; return foo })({ 1: 2 })); // 2

        console.log(((outer, foo = outer) => { return outer })()); // undefined
        console.log(((foo = outer) => { return outer })()); // 1
        console.log(((foo = outer) => { var outer; return outer })()); // undefined
        console.log(((foo = outer) => { let outer; return outer })()); // undefined
        console.log(((outer, { [outer]: foo }) => { return outer })('key', { key: 2 })); // "key"
        console.log(((outer, { [outer]: foo }) => { var outer; return outer })('key', { key: 2 })); // "key"
        console.log((({ [outer]: foo }) => { return outer })({ 1: 2 })); // 1
        console.log((({ [outer]: foo }) => { var outer; return outer })({ 1: 2 })); // undefined
        console.log((({ [outer]: foo }) => { let outer; return outer })({ 1: 2 })); // undefined
    }
    expect: {
        const outer = 1;

        console.log(((outer, foo = outer) => { return foo })());
        console.log(((o = outer) => { return o })()); // mangled!
        console.log(((foo = outer) => { var outer; return foo })());
        console.log(((foo = outer) => { let outer; return foo })());
        console.log(((outer, { [outer]: foo }) => { return foo })('key', { key: 2 })); // 2
        console.log(((outer, { [outer]: foo }) => { var outer; return foo })('key', { key: 2 })); // undefined
        console.log((({ [outer]: o }) => { return o })({ 1: 2 })); // 2
        console.log((({ [outer]: foo }) => { var outer; return foo })({ 1: 2 })); // 2
        console.log((({ [outer]: foo }) => { let outer; return foo })({ 1: 2 })); // 2

        console.log(((outer, foo = outer) => { return outer })());
        console.log(((o = outer) => { return outer })()); // mangled!
        console.log(((foo = outer) => { var outer; return outer })());
        console.log(((foo = outer) => { let outer; return outer })());
        console.log(((outer, { [outer]: foo }) => { return outer })('key', { key: 2 })); // "key"
        console.log(((outer, { [outer]: foo }) => { var outer; return outer })('key', { key: 2 })); // "key"
        console.log((({ [outer]: o }) => { return outer })({ 1: 2 })); // 1
        console.log((({ [outer]: foo }) => { var outer; return outer })({ 1: 2 })); // undefined
        console.log((({ [outer]: foo }) => { let outer; return outer })({ 1: 2 })); // undefined
    }
    expect_stdout: [
        "undefined",
        "1",
        "1",
        "1",
        "2",
        "2",
        "2",
        "2",
        "2",

        "undefined",
        "1",
        "undefined",
        "undefined",
        "key",
        "key",
        "1",
        "undefined",
        "undefined",
    ]
}
