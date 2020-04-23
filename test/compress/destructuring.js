destructuring_arrays: {
    input: {
        {const [aa, bb] = cc;}
        {const [aa, [bb, cc]] = dd;}
        {let [aa, bb] = cc;}
        {let [aa, [bb, cc]] = dd;}
        var [aa, bb] = cc;
        var [aa, [bb, cc]] = dd;
        var [,[,,,,,],,,zz,] = xx; // Trailing comma
        var [,,zzz,,] = xxx; // Trailing comma after hole
    }
    expect: {
        {const [aa, bb] = cc;}
        {const [aa, [bb, cc]] = dd;}
        {let [aa, bb] = cc;}
        {let [aa, [bb, cc]] = dd;}
        var [aa, bb] = cc;
        var [aa, [bb, cc]] = dd;
        var [,[,,,,,],,,zz] = xx;
        var [,,zzz,,] = xxx;
    }
}

destructuring_arrays_holes: {
    input: {
        var [,,,,] = a;
        var [,,b,] = c;
        var [d,,]  = e;
    }
    expect_exact: "var[,,,,]=a;var[,,b]=c;var[d,,]=e;"
}

destructuring_objects: {
    input: {
        {const {aa, bb} = {aa:1, bb:2};}
        {const {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        {let {aa, bb} = {aa:1, bb:2};}
        {let {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        var {aa, bb} = {aa:1, bb:2};
        var {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};
    }
    expect: {
        {const {aa, bb} = {aa:1, bb:2};}
        {const {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        {let {aa, bb} = {aa:1, bb:2};}
        {let {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        var {aa, bb} = {aa:1, bb:2};
        var {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};
    }
}

destructuring_objects_trailing_elision: {
    beautify = {
        ecma: 2015
    }
    input: {
        var {cc,} = foo;
    }
    expect_exact: "var{cc}=foo;"
}

nested_destructuring_objects: {
    beautify = {
        ecma: 2015
    }
    input: {
        const [{a},b] = c;
        let [{d},e] = f;
        var [{g},h] = i;
    }
    expect_exact: 'const[{a},b]=c;let[{d},e]=f;var[{g},h]=i;';
}

destructuring_constdef_in_loops: {
    beautify = {
        ecma: 2015
    }
    input: {
        for (const [x,y] in pairs);
        for (const [a] = 0;;);
        for (const {c} of cees);
    }
    expect_exact: "for(const[x,y]in pairs);for(const[a]=0;;);for(const{c}of cees);"
}

destructuring_letdef_in_loops: {
    beautify = {
        ecma: 2015
    }
    input: {
        for (let [x,y] in pairs);
        for (let [a] = 0;;);
        for (let {c} of cees);
    }
    expect_exact: "for(let[x,y]in pairs);for(let[a]=0;;);for(let{c}of cees);"
}

destructuring_vardef_in_loops: {
    beautify = {
        ecma: 2015
    }
    input: {
        for (var [x,y] in pairs);
        for (var [a] = 0;;);
        for (var {c} of cees);
    }
    expect_exact: "for(var[x,y]in pairs);for(var[a]=0;;);for(var{c}of cees);"
}

destructuring_expressions: {
    beautify = {
        ecma: 2015
    }
    input: {
        ({a, b});
        [{a}];
        f({x});
    }
    expect_exact: "({a,b});[{a}];f({x});"
}

destructuring_remove_unused_1: {
    options = {
        unused: true
    }
    input: {
        function a() {
            var unused = "foo";
            var a = [1];
            var [b] = a;
            f(b);
        }
        function b() {
            var unused = "foo";
            var a = {b: 1};
            var {b} = a;
            f(b);
        }
        function c() {
            var unused = "foo";
            var a = [[1]];
            var [[b]] = a;
            f(b);
        }
        function d() {
            var unused = "foo";
            var a = {b: {b:1}};
            var {b:{b}} = a;
            f(b);
        }
        function e() {
            var unused = "foo";
            var a = [1, 2, 3, 4, 5];
            var x = [[1, 2, 3]];
            var y = {h: 1};
            var [b, ...c] = a;
            var [...[e, f]] = x;
            var [...{g: h}] = y;
            f(b, c, e, f, g);
        }
    }
    expect: {
        function a() {
            var a = [1];
            var [b] = a;
            f(b);
        }
        function b() {
            var a = {b: 1};
            var {b} = a;
            f(b);
        }
        function c() {
            var a = [[1]];
            var [[b]] = a;
            f(b);
        }
        function d() {
            var a = {b: {b:1}};
            var {b:{b}} = a;
            f(b);
        }
        function e() {
            var a = [1, 2, 3, 4, 5];
            var x = [[1, 2, 3]];
            var y = {h: 1};
            var [b, ...c] = a;
            var [...[e, f]] = x;
            var [...{g: h}] = y;
            f(b, c, e, f, g);
        }
    }
}

destructuring_remove_unused_2: {
    options = {
        unused: true
    }
    input: {
        function a() {
            var unused = "foo";
            var a = [,,1];
            var [b] = a;
            f(b);
        }
        function b() {
            var unused = "foo";
            var a = [{a: [1]}];
            var [{b: a}] = a;
            f(b);
        }
    }
    expect: {
        function a() {
            var a = [,,1];
            var [b] = a;
            f(b);
        }
        function b() {
            var a = [{a: [1]}];
            var [{b: a}] = a;
            f(b);
        }
    }
}

object_destructuring_may_need_parentheses: {
    beautify = {
        ecma: 2015
    }
    input: {
        ({a, b} = {a: 1, b: 2});
    }
    expect_exact: "({a,b}={a:1,b:2});"
}

destructuring_with_undefined_as_default_assignment: {
    options = {
        evaluate: true
    }
    input: {
        [foo = undefined] = bar;
        [foo = void 0] = bar;
    }
    expect: {
        [foo] = bar;
        [foo] = bar;
    }
}

destructuring_dont_evaluate_with_undefined_as_default_assignment: {
    options = {
        evaluate: false
    }
    input: {
        [foo = undefined] = bar;
    }
    expect: {
        [foo = void 0] = bar;
    }
}

reduce_vars: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        {const [aa, [bb, cc]] = dd;}
        {let [aa, [bb, cc]] = dd;}
        var [aa, [bb, cc]] = dd;
        [aa, [bb, cc]] = dd;
        {const {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        {let {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        var {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};
        ({aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}});
        const [{a},b] = c;
        let [{d},e] = f;
        var [{g},h] = i;
        [{a},b] = c;
        for (const [x,y] in pairs);
        for (let [x,y] in pairs);
        for (var [x,y] in pairs);
        for ([x,y] in pairs);
    }
    expect: {
        {const [aa, [bb, cc]] = dd;}
        {let [aa, [bb, cc]] = dd;}
        var [aa, [bb, cc]] = dd;
        [aa, [bb, cc]] = dd;
        {const {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        {let {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};}
        var {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};
        ({aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}});
        const [{a},b] = c;
        let [{d},e] = f;
        var [{g},h] = i;
        [{a},b] = c;
        for (const [x,y] in pairs);
        for (let [x,y] in pairs);
        for (var [x,y] in pairs);
        for ([x,y] in pairs);
    }
}

unused: {
    options = {
        unused: true,
    }
    input: {
        let { foo: [, , ...a] } = { foo: [1, 2, 3, 4], bar: 5 };
        console.log(a);
    }
    expect: {
        let { foo: [, , ...a] } = { foo: [1, 2, 3, 4], bar: 5 };
        console.log(a);
    }
}

issue_1886: {
    options = {
        collapse_vars: true,
    }
    input: {
        let [a] = [1];
        console.log(a);
    }
    expect: {
        let [a] = [1];
        console.log(a);
    }
}

destructuring_decl_of_numeric_key: {
    options = {
        evaluate: true,
        unused: true,
    }
    input: {
        let { 3: x } = { [1 + 2]: 42 };
        console.log(x);
    }
    expect: {
        let { 3: x } = { [3]: 42 };
        console.log(x);
    }
    expect_stdout: "42"
}

destructuring_decl_of_computed_key: {
    options = {
        evaluate: true,
        unused: true,
    }
    input: {
        let four = 4;
        let { [7 - four]: x } = { [1 + 2]: 42 };
        console.log(x);
    }
    expect: {
        let four = 4;
        let { [7 - four]: x } = { [3]: 42 };
        console.log(x);
    }
    expect_stdout: "42"
}

destructuring_assign_of_numeric_key: {
    options = {
        evaluate: true,
        unused: true,
    }
    input: {
        let x;
        ({ 3: x } = { [1 + 2]: 42 });
        console.log(x);
    }
    expect: {
        let x;
        ({ 3: x } = { [3]: 42 });
        console.log(x);
    }
    expect_stdout: "42"
}

destructuring_assign_of_computed_key: {
    options = {
        evaluate: true,
        unused: true,
    }
    input: {
        let x;
        let four = 4;
        ({ [(5 + 2) - four]: x } = { [1 + 2]: 42 });
        console.log(x);
    }
    expect: {
        let x;
        let four = 4;
        ({ [7 - four]: x } = { [3]: 42 });
        console.log(x);
    }
    expect_stdout: "42"
}

mangle_destructuring_decl: {
    options = {
        evaluate: true,
        unused: true,
    }
    mangle = {
    }
    input: {
        function test(opts) {
            let a = opts.a || { e: 7, n: 8 };
            let { t, e, n, s =  5 + 4, o, r } = a;
            console.log(t, e, n, s, o, r);
        }
        test({a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 }});
        test({});
    }
    expect: {
        function test(t) {
            let e = t.a || { e: 7, n: 8 };
            let {t: n,  e: o,  n: s,  s: l = 9,  o: a,  r: c} = e;
            console.log(n, o, s, l, a, c);
        }
        test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
        test({});
    }
    expect_stdout: [
        "1 2 3 4 5 6",
        "undefined 7 8 9 undefined undefined",
    ]
}

mangle_destructuring_decl_collapse_vars: {
    options = {
        collapse_vars: true,
        evaluate: true,
        unused: true,
    }
    mangle = {
    }
    input: {
        function test(opts) {
            let a = opts.a || { e: 7, n: 8 };
            let { t, e, n, s =  5 + 4, o, r } = a;
            console.log(t, e, n, s, o, r);
        }
        test({a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 }});
        test({});
    }
    expect: {
        function test(t) {
            let e = t.a || { e: 7, n: 8 };
            let {t: n,  e: o,  n: s,  s: l = 9,  o: a,  r: c} = e;
            console.log(n, o, s, l, a, c);
        }
        test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
        test({});
    }
    expect_stdout: [
        "1 2 3 4 5 6",
        "undefined 7 8 9 undefined undefined",
    ]
}

mangle_destructuring_assign_toplevel_true: {
    options = {
        toplevel: true,
        evaluate: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    beautify = {
        ecma: 2015
    }
    input: {
        function test(opts) {
            let s, o, r;
            let a = opts.a || { e: 7, n: 8 };
            ({ t, e, n, s =  5 + 4, o, r } = a);
            console.log(t, e, n, s, o, r);
        }
        let t, e, n;
        test({a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 }});
        test({});
    }
    expect: {
        function e(e) {
            let l, s, a;
            let c = e.a || { e: 7, n: 8 };
            ({t: n,  e: o,  n: t,  s: l = 9,  o: s,  r: a} = c);
            console.log(n, o, t, l, s, a);
        }
        let n, o, t;
        e({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
        e({});
    }
    expect_stdout: [
        "1 2 3 4 5 6",
        "undefined 7 8 9 undefined undefined",
    ]
}

mangle_destructuring_assign_toplevel_false: {
    options = {
        toplevel: false,
        evaluate: true,
        unused: true,
    }
    mangle = {
        toplevel: false,
    }
    beautify = {
        ecma: 2015
    }
    input: {
        function test(opts) {
            let s, o, r;
            let a = opts.a || { e: 7, n: 8 };
            ({ t, e, n, s = 9, o, r } = a);
            console.log(t, e, n, s, o, r);
        }
        let t, e, n;
        test({a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 }});
        test({});
    }
    expect: {
        function test(o) {
            let s, l, a;
            let c = o.a || { e: 7, n: 8 };
            ({t,  e,  n,  s = 9,  o: l,  r: a} = c);
            console.log(t, e, n, s, l, a);
        }
        let t, e, n;
        test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
        test({});
    }
    expect_stdout: [
        "1 2 3 4 5 6",
        "undefined 7 8 9 undefined undefined",
    ]
}

mangle_destructuring_decl_array: {
    options = {
        evaluate: true,
        unused: true,
        toplevel: true,
    }
    mangle = {
        toplevel: true,
    }
    beautify = {
        ecma: 2015
    }
    input: {
        var [, t, e, n, s, o = 2, r = [ 1 + 2 ]] = [ 9, 8, 7, 6 ];
        console.log(t, e, n, s, o, r);
    }
    expect: {
        var [, o,  l,  a,  c,  e = 2,  g = [ 3 ]] = [ 9, 8, 7, 6 ];
        console.log(o, l, a, c, e, g);
    }
    expect_stdout: "8 7 6 undefined 2 [ 3 ]"
}

anon_func_with_destructuring_args: {
    options = {
        evaluate: true,
        unused: true,
        toplevel: true,
    }
    mangle = {
        toplevel: true,
    }
    beautify = {
        ecma: 5,
    }
    input: {
        (function({foo = 1 + 0, bar = 2}, [car = 3, far = 4]) {
            console.log(foo, bar, car, far);
        })({bar: 5 - 0}, [, 6]);
    }
    expect: {
        (function({foo: o = 1, bar: n = 2}, [a = 3, b = 4]) {
            console.log(o, n, a, b);
        })({bar: 5}, [, 6]);
    }
    expect_stdout: "1 5 3 6"
}

arrow_func_with_destructuring_args: {
    options = {
        evaluate: true,
        unused: true,
        toplevel: true,
    }
    mangle = {
        toplevel: true,
    }
    beautify = {
        ecma: 5,
    }
    input: {
        (({foo = 1 + 0, bar = 2}, [car = 3, far = 4]) => {
            console.log(foo, bar, car, far);
        })({bar: 5 - 0}, [, 6]);
    }
    expect: {
        (({foo: o = 1, bar: a = 2}, [b = 3, l = 4]) => {
            console.log(o, a, b, l);
        })({bar: 5}, [, 6]);
    }
    expect_stdout: "1 5 3 6"
}

issue_2044_ecma_5: {
    beautify = {
        beautify: false,
        ecma: 5,
    }
    input: {
        ({x : a = 1, y = 2 + b, z = 3 - c} = obj);
    }
    expect_exact: "({x:a=1,y:y=2+b,z:z=3-c}=obj);"
}

issue_2044_ecma_6: {
    beautify = {
        beautify: false,
        ecma: 2015,
    }
    input: {
        ({x : a = 1, y = 2 + b, z = 3 - c} = obj);
    }
    expect_exact: "({x:a=1,y=2+b,z=3-c}=obj);"
}

issue_2044_ecma_5_beautify: {
    beautify = {
        beautify: true,
        ecma: 5,
    }
    input: {
        ({x : a = 1, y = 2 + b, z = 3 - c} = obj);
    }
    expect_exact: "({x: a = 1, y: y = 2 + b, z: z = 3 - c} = obj);"
}

issue_2044_ecma_6_beautify: {
    beautify = {
        beautify: true,
        ecma: 2015,
    }
    input: {
        ({x : a = 1, y = 2 + b, z = 3 - c} = obj);
    }
    expect_exact: "({x: a = 1, y = 2 + b, z = 3 - c} = obj);"
}

issue_2140: {
    options = {
        unused: true,
    }
    input: {
        !function() {
            var t = {};
            console.log(([t.a] = [42])[0]);
        }();
    }
    expect: {
        !function() {
            var t = {};
            console.log(([t.a] = [42])[0]);
        }();
    }
    expect_stdout: "42"
}

issue_3205_1: {
    options = {
        inline: 3,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f(a) {
            function g() {
                var {b, c} = a;
                console.log(b, c);
            }
            g();
        }
        f({ b: 2, c: 3 });
    }
    expect: {
        function f(a) {
            (function() {
                var {b: b, c: c} = a;
                console.log(b, c);
            })();
        }
        f({ b: 2, c: 3 });
    }
    expect_stdout: "2 3"
}

issue_3205_2: {
    options = {
        inline: 3,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            function f() {
                var o = { a: "PASS" }, {a: x} = o;
                console.log(x);
            }
            f();
        })();
    }
    expect: {
        (function() {
            function f() {
                var o = { a: "PASS" }, {a: x} = o;
                console.log(x);
            }
            f();
        })();
    }
    expect_stdout: "PASS"
}

issue_3205_3: {
    options = {
        inline: 3,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            function f(o, {a: x} = o) {
                console.log(x);
            }
            f({ a: "PASS" });
        })();
    }
    expect: {
        (function() {
            function f(o, {a: x} = o) {
                console.log(x);
            }
            f({ a: "PASS" });
        })();
    }
    expect_stdout: "PASS"
}

issue_3205_4: {
    options = {
        inline: 3,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            function f(o) {
                var {a: x} = o;
                console.log(x);
            }
            f({ a: "PASS" });
        })();
    }
    expect: {
        (function() {
            function f(o) {
                var {a: x} = o;
                console.log(x);
            }
            f({ a: "PASS" });
        })();
    }
    expect_stdout: "PASS"
}

issue_3205_5: {
    options = {
        inline: 3,
        passes: 4,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            function f(g) {
                var o = g, {a: x} = o;
                console.log(x);
            }
            f({ a: "PASS" });
        })();
    }
    expect: {
        !function(g) {
            var {a: x} = {
                a: "PASS"
            };
            console.log(x);
        }();
    }
    expect_stdout: "PASS"
}

unused_destructuring_decl_1: {
    options = {
        pure_getters: true,
        toplevel: true,
        unused: true,
    }
    input: {
        let { x: L, y } = { x: 2 };
        var { U: u, V } = { V: 3 };
        const { C, D } = { C: 1, D: 4 };
        console.log(L, V);
    }
    expect: {
        let { x: L } = { x: 2 };
        var { V } = { V: 3 };
        console.log(L, V);
    }
    expect_stdout: "2 3"
}

unused_destructuring_decl_2: {
    options = {
        pure_getters: true,
        toplevel: false,
        unused: true,
    }
    input: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, f: g, h = new Object(2) } = { e: 8 };
        var { w, x: y, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, f: g, h = new Object(2) } = { e: 8 };
        var { w, x: y, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect_stdout: "7 8 3"
}

unused_destructuring_decl_3: {
    options = {
        pure_getters: false,
        toplevel: true,
        unused: true,
    }
    input: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, f: g, h = new Object(2) } = { e: 8 };
        var { w, x: y, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, f: g, h = new Object(2) } = { e: 8 };
        var { w, x: y, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect_stdout: "7 8 3"
}

unused_destructuring_decl_4: {
    options = {
        pure_getters: true,
        toplevel: true,
        unused: false,
    }
    input: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, f: g, h = new Object(2) } = { e: 8 };
        var { w, x: y, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, f: g, h = new Object(2) } = { e: 8 };
        var { w, x: y, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect_stdout: "7 8 3"
}

unused_destructuring_decl_5: {
    options = {
        pure_getters: true,
        toplevel: true,
        top_retain: [ "a", "e", "w" ],
        unused: true,
    }
    input: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, f: g, h = new Object(2) } = { e: 8 };
        var { w, x: y, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect: {
        const { a, b: c, d = new Object(1) } = { b: 7 };
        let { e, h = new Object(2) } = { e: 8 };
        var { w, z = new Object(3) } = { w: 4, x: 5, y: 6 };
        console.log(c, e, z + 0);
    }
    expect_stdout: "7 8 3"
}

unused_destructuring_function_param: {
    options = {
        pure_getters: true,
        unused: true,
    }
    input: {
        function foo({w = console.log("side effect"), x, y: z}) {
            console.log(x);
        }
        foo({x: 1, y: 2, z: 3});
    }
    expect: {
        function foo({w = console.log("side effect"), x}) {
            console.log(x);
        }
        foo({x: 1, y: 2, z: 3});
    }
    expect_stdout: [
        "side effect",
        "1",
    ]
}

unused_destructuring_arrow_param: {
    options = {
        pure_getters: true,
        unused: true,
    }
    input: {
        let bar = ({w = console.log("side effect"), x, y: z}) => {
            console.log(x);
        };
        bar({x: 4, y: 5, z: 6});
    }
    expect: {
        let bar = ({w = console.log("side effect"), x}) => {
            console.log(x);
        };
        bar({x: 4, y: 5, z: 6});
    }
    expect_stdout: [
        "side effect",
        "4",
    ]
}

unused_destructuring_object_method_param: {
    options = {
        pure_getters: true,
        unused: true,
    }
    input: {
        ({
            baz({w = console.log("side effect"), x, y: z}) {
                console.log(x);
            }
        }).baz({x: 7, y: 8, z: 9});
    }
    expect: {
        ({
            baz({w = console.log("side effect"), x}) {
                console.log(x);
            }
        }).baz({x: 7, y: 8, z: 9});
    }
    expect_stdout: [
        "side effect",
        "7",
    ]
}

unused_destructuring_class_method_param: {
    options = {
        pure_getters: true,
        unused: true,
    }
    input: {
        (new class {
            baz({w = console.log("side effect"), x, y: z}) {
                console.log(x);
            }
        }).baz({x: 7, y: 8, z: 9});
    }
    expect: {
        (new class {
            baz({w = console.log("side effect"), x}) {
                console.log(x);
            }
        }).baz({x: 7, y: 8, z: 9});
    }
    expect_stdout: [
        "side effect",
        "7",
    ]
}

unused_destructuring_getter_side_effect_1: {
    options = {
        pure_getters: false,
        unused: true,
    }
    input: {
        function extract(obj) {
            const { a, b } = obj;
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({
            get a() {
                var s = "side effect";
                console.log(s);
                return s;
            },
            b: 4,
        });
    }
    expect: {
        function extract(obj) {
            const { a, b } = obj;
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({
            get a() {
                var s = "side effect";
                console.log(s);
                return s;
            },
            b: 4,
        });
    }
    expect_stdout: [
        "2",
        "side effect",
        "4",
    ]
}

unused_destructuring_getter_side_effect_2: {
    options = {
        pure_getters: true,
        unused: true,
    }
    input: {
        function extract(obj) {
            const { a, b } = obj;
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({
            get a() {
                var s = "side effect";
                console.log(s);
                return s;
            },
            b: 4,
        });
    }
    expect: {
        function extract(obj) {
            const { b } = obj;
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({
            get a() {
                var s = "side effect";
                console.log(s);
                return s;
            },
            b: 4,
        });
    }
    // No `expect_stdout` clause here because `pure_getters`
    // drops the getter side effect as expected and produces
    // different output than the original `input` code.
}

unused_destructuring_assign_1: {
    options = {
        pure_getters: true,
        unused: true,
    }
    input: {
        function extract(obj) {
            var a;
            let b;
            ({ a, b } = obj);
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({b: 4});
    }
    expect: {
        function extract(obj) {
            var a;
            let b;
            ({ a, b } = obj);  // TODO: future optimization opportunity
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({b: 4});
    }
    expect_stdout: [
        "2",
        "4",
    ]
}

unused_destructuring_assign_2: {
    options = {
        pure_getters: false,
        unused: true,
    }
    input: {
        function extract(obj) {
            var a;
            let b;
            ({ a, b } = obj);
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({
            get a() {
                var s = "side effect";
                console.log(s);
                return s;
            },
            b: 4,
        });
    }
    expect: {
        function extract(obj) {
            var a;
            let b;
            ({ a, b } = obj);
            console.log(b);
        }
        extract({a: 1, b: 2});
        extract({
            get a() {
                var s = "side effect";
                console.log(s);
                return s;
            },
            b: 4,
        });
    }
    expect_stdout: [
        "2",
        "side effect",
        "4",
    ]
}

export_unreferenced_declarations_1: {
    options = {
        module: true,
        pure_getters: true,
        unused: true,
    }
    beautify = {
        beautify: false,
        ecma: 2015,
    }
    input: {
        export const { keys } = Object;
        export let { L, M } = Object;
        export var { V, W } = Object;
    }
    expect_exact: "export const{keys}=Object;export let{L,M}=Object;export var{V,W}=Object;"
}

export_unreferenced_declarations_2: {
    options = {
        module: true,
        pure_getters: true,
        unused: true,
    }
    input: {
        var {unused} = obj;
        export const [{a, b = 1}] = obj;
        export let [[{c, d = 2}]] = obj;
        export var [, [{e, f = 3}]] = obj;
    }
    expect: {
        obj;
        export const [{a, b = 1}] = obj;
        export let [[{c, d = 2}]] = obj;
        export var [, [{e, f = 3}]] = obj;
    }
}

export_function_containing_destructuring_decl: {
    options = {
        module: true,
        pure_getters: true,
        unused: true,
    }
    input: {
        export function f() {
            let [{x, y, z}] = [{x: 1, y: 2}];
            return x;
        }
    }
    expect: {
        export function f() {
            let [{x}] = [{x: 1, y: 2}];
            return x;
        }
    }
}

unused_destructuring_declaration_complex_1: {
    options = {
        toplevel: true,
        pure_getters: true,
        unused: true,
    }
    input: {
        const [, w, , x, {y, z}] = [1, 2, 3, 4, {z: 5}];
        console.log(x, z);
    }
    expect: {
        // TODO: unused destructuring array declarations not optimized
        const [, w, , x, {z}] = [1, 2, 3, 4, {z: 5}];
        console.log(x, z);
    }
    expect_stdout: "4 5"
}

unused_destructuring_declaration_complex_2: {
    options = {
        toplevel: true,
        pure_getters: false,
        unused: true,
    }
    input: {
        const [, w, , x, {y, z}] = [1, 2, 3, 4, {z: 5}];
        console.log(x, z);
    }
    expect: {
        const [, w, , x, {y, z}] = [1, 2, 3, 4, {z: 5}];
        console.log(x, z);
    }
    expect_stdout: "4 5"
}

unused_destructuring_multipass: {
    options = {
        conditionals: true,
        evaluate: true,
        toplevel: true,
        passes: 2,
        pure_getters: true,
        side_effects: true,
        unused: true,
    }
    input: {
        let { w, x: y, z } = { x: 1, y: 2, z: 3 };
        console.log(y);
        if (0) {
            console.log(z);
        }
    }
    expect: {
        let { x: y } = { x: 1, y: 2, z: 3 };
        console.log(y);
    }
    expect_stdout: "1"
}

issue_t111_1: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        var p = x => (console.log(x), x), unused = p(1), {} = p(2);
    }
    expect: {
        var p = x => (console.log(x), x), {} = (p(1), p(2));
    }
    expect_stdout: [
        "1",
        "2",
    ]
}

issue_t111_2a: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        var p = x => (console.log(x), x), a = p(1), {} = p(2), c = p(3), d = p(4);
    }
    expect: {
        var p = x => (console.log(x), x), {} = (p(1), p(2));
        p(3), p(4);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
        "4",
    ]
}

issue_t111_2b: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        let p = x => (console.log(x), x), a = p(1), {} = p(2), c = p(3), d = p(4);
    }
    expect: {
        let p = x => (console.log(x), x), {} = (p(1), p(2));
        p(3), p(4);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
        "4",
    ]
}

issue_t111_2c: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        const p = x => (console.log(x), x), a = p(1), {} = p(2), c = p(3), d = p(4);
    }
    expect: {
        const p = x => (console.log(x), x), {} = (p(1), p(2));
        p(3), p(4);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
        "4",
    ]
}

issue_t111_3: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        let p = x => (console.log(x), x), a = p(1), {} = p(2), c = p(3), {} = p(4);
    }
    expect: {
        let p = x => (console.log(x), x), {} = (p(1), p(2)), {} = (p(3), p(4));
    }
    expect_stdout: [
        "1",
        "2",
        "3",
        "4",
    ]
}

issue_t111_4: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        let p = x => (console.log(x), x), a = 1, {length} = [0], c = 3, {x} = {x: 2};
        p(`${length} ${x}`);
    }
    expect: {
        let p = x => (console.log(x), x), {length} = [0], {x} = {x: 2};
        p(`${length} ${x}`);
    }
    expect_stdout: "1 2"
}

empty_object_destructuring_1: {
    options = {
        pure_getters: false,
        toplevel: true,
        unused: true,
    }
    input: {
        var {} = Object;
        let {L} = Object, L2 = "foo";
        const bar = "bar", {prop: C1, C2 = console.log("side effect"), C3} = Object;
    }
    expect: {
        var {} = Object;
        let {L: L} = Object;
        const {prop: C1, C2: C2 = console.log("side effect"), C3: C3} = Object;
    }
    expect_stdout: "side effect"
}

empty_object_destructuring_2: {
    options = {
        pure_getters: "strict",
        toplevel: true,
        unused: true,
    }
    input: {
        var {} = Object;
        let {L} = Object, L2 = "foo";
        const bar = "bar", {prop: C1, C2 = console.log("side effect"), C3} = Object;
    }
    expect: {
        var {} = Object;
        let {L: L} = Object;
        const {prop: C1, C2: C2 = console.log("side effect"), C3: C3} = Object;
    }
    expect_stdout: "side effect"
}

empty_object_destructuring_3: {
    options = {
        pure_getters: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var {} = Object;
        let {L} = Object, L2 = "foo";
        const bar = "bar", {prop: C1, C2 = console.log("side effect"), C3} = Object;
    }
    expect: {
        const {C2: C2 = console.log("side effect")} = Object;
    }
    expect_stdout: "side effect"
}

empty_object_destructuring_4: {
    options = {
        pure_getters: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        var {} = Object;
        let {L} = Object, L2 = "foo";
        const bar = "bar", {prop: C1, C2 = console.log("side effect"), C3} = Object;
    }
    expect: {
        const {C2: C2 = console.log("side effect")} = Object;
    }
    expect_stdout: "side effect"
}

empty_object_destructuring_misc: {
    options = {
        pure_getters: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        let out = [],
            foo = (out.push(0), 1),
            {} = {k: 9},
            bar = out.push(2),
            {unused} = (out.push(3), {unused: 7}),
            {a: b, prop, w, x: y, z} = {prop: 8},
            baz = (out.push(4), 5);
        console.log(`${foo} ${prop} ${baz} ${JSON.stringify(out)}`);
    }
    expect: {
        let out = [],
            foo = (out.push(0), 1),
            {prop: prop} = (out.push(2), out.push(3), {prop: 8}),
            baz = (out.push(4), 5);
        console.log(`${foo} ${prop} ${baz} ${JSON.stringify(out)}`);
    }
    expect_stdout: "1 8 5 [0,2,3,4]"
}

destructure_empty_array_1: {
    options = {
        pure_getters: false,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        let {} = Object, [] = {}, unused = console.log("not reached");
    }
    expect: {
        let {} = Object, [] = {};
        console.log("not reached");
    }
    expect_stdout: true // TypeError: {} is not iterable
}

destructure_empty_array_2: {
    options = {
        pure_getters: "strict",
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        let {} = Object, [] = {}, unused = console.log("not reached");
    }
    expect: {
        let {} = Object, [] = {};
        console.log("not reached");
    }
    expect_stdout: true // TypeError: {} is not iterable
}

destructure_empty_array_3: {
    options = {
        pure_getters: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        let {} = Object, [] = {}, unused = console.log("not reached");
    }
    expect: {
        let [] = {};
        console.log("not reached");
    }
    expect_stdout: true // TypeError: {} is not iterable
}
