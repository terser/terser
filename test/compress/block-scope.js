
let_statement: {
    input: {
        let x = 6;
    }
    expect_exact: "let x=6;"
}

do_not_hoist_let: {
    options = {
        hoist_vars: true,
    };
    input: {
        function x() {
            if (FOO) {
                let let1;
                let let2;
                var var1;
                var var2;
            }
        }
    }
    expect: {
        function x() {
            var var1, var2;
            if (FOO) {
                let let1;
                let let2;
            }
        }
    }
}

do_not_remove_anon_blocks_if_they_have_decls: {
    input: {
        function x() {
            {
                let x;
            }
            {
                var x;
            }
            {
                const y = 1;
                class Zee {};
            }
        }
        {
            let y;
        }
        {
            var y;
        }
    }
    expect: {
        function x(){
            {
                let x
            }
            var x;
            {
                const y = 1;
                class Zee {}
            }
        }
        {
            let y
        }
        var y;
    }
}

remove_unused_in_global_block: {
    options = {
        unused: true,
    }
    input: {
        {
            let x;
            const y = 1;
            class Zee {};
            var w;
        }
        let ex;
        const why = 2;
        class Zed {};
        var wut;
        console.log(x, y, Zee);
    }
    expect: {
        var w;
        let ex;
        const why = 2;
        class Zed {};
        var wut;
        console.log(x, y, Zee);
    }
}

regression_block_scope_resolves: {
    mangle = { };
    options = {
        dead_code: false
    };
    input: {
        (function () {
            if (1) {
                let x;
                const y = 1;
                class Zee {};
            }
            if (1) {
                let ex;
                const why = 2;
                class Zi {};
            }
            console.log(typeof x, typeof y, typeof Zee, typeof ex, typeof why, typeof Zi);
        }());
    }
    expect: {
        (function () {
            if (1) {
                let e;
                const o = 1;
                class t {};
            }
            if (1) {
                let e;
                const o = 2;
                class t {};
            }
            console.log(typeof x, typeof y, typeof Zee, typeof ex, typeof why, typeof Zi);
        }());
    }
    expect_stdout: "undefined undefined undefined undefined undefined undefined"
}

switch_block_scope_mangler: {
    mangle = {}
    input: {
        var fn = function(code) {
            switch (code) {
                case 1:
                    let apple = code + 1;
                    let dog = code + 4;
                    console.log(apple, dog);
                    break;
                case 2:
                    let banana = code + 2;
                    console.log(banana);
                    break;
                default:
                    let cat = code + 3;
                    console.log(cat);
            }
        };
        fn(1);
        fn(2);
        fn(3);
    }
    expect: {
        var fn = function(e) {
            switch (e) {
              case 1:
                let l = e + 1
                let o = e + 4;
                console.log(l, o);
                break;

              case 2:
                let n = e + 2;
                console.log(n);
                break;

              default:
                let c = e + 3;
                console.log(c);
            }
        };
        fn(1);
        fn(2);
        fn(3);
    }
    expect_stdout: [
        "2 5",
        "4",
        "6",
    ]
}

issue_241: {
    options = {
        defaults: true,
    }
    input: {
        var a = {};

        (function(global) {
            function fail(o) {
                var result = {};

                function inner() {
                    return outer({
                        one: o.one,
                        two: o.two
                    });
                }

                result.inner = function() {
                    return inner();
                };

                return result;
            }

            function outer(o) {
                var ret;

                if (o) {
                    ret = o.one;
                } else {
                    ret = o.two;
                }

                return ret;
            }

            global.fail = fail;
        })(a);

        var b = a.fail({one:"PASS"});
        console.log(b.inner());
    }
    expect_stdout: "PASS"
}

issue_334: {
    options = {
        defaults: true,
        toplevel: true
    };
    input: {
        (function (A) {
            (function () {
                doPrint();
            })();

            function doPrint() {
                print(A);
            }
        }("Hello World!"));

        function print(A) {
            if (!A.x) {
                console.log(A);
            }
        }
    }
    expect: {
        var A;
        (A="Hello World!").x || console.log(A);
    }
    expect_stdout: "Hello World!";
}

issue_508: {
    options = {
        defaults: true,
        toplevel: true,
        pure_getters: true
    }
    input : {
        const foo = () => {
            let a;
            {
                let b = [];
                {
                    console.log();
                }
                a = b;

                {
                    let c = a;
                    let b = 123456;
                    console.log(b);
                    c.push(b);
                }
            }
        };

        foo();
    }
    expect_stdout: [
        "",
        "123456"
    ]
}
