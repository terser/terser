drop_fnames: {
    mangle = {
        keep_fnames : false,
    }
    input: {
        function foo() {
            function bar() {
                return "foobar";
            }
        }
    }
    expect: {
        function foo() {
            function o() {
                return "foobar";
            }
        }
    }
}

keep_fnames: {
    mangle = {
        keep_fnames: true,
    }
    input: {
        function foo() {
            function bar() {
                return "foobar";
            }
        }
    }
    expect: {
        function foo() {
            function bar() {
                return "foobar";
            }
        }
    }
}

keep_var_fnames: {
    mangle = {
        keep_fnames: true,
        toplevel: true,
    }
    input: {
        const foo = function () { return "barfoo" }
        const bar = () => "foobar"
    }
    expect: {
        const foo = function () { return "barfoo" }
        const bar = () => "foobar"
    }
}

drop_classnames: {
    mangle = {
        keep_classnames : false,
    }
    input: {
        function foo() {
            class Bar {}
        }
    }
    expect: {
        function foo() {
            class o {}
        }
    }
}

keep_classnames: {
    mangle = {
        keep_classnames: true,
    }
    input: {
        function foo() {
            class Bar {}
        }
    }
    expect: {
        function foo() {
            class Bar {}
        }
    }
}

keep_some_fnames: {
    mangle = {
        keep_fnames: /Element$/,
    }
    input: {
        function foo() {
            function bar() {}
            function barElement() {}
        }
    }
    expect: {
        function foo() {
            function n() {}
            function barElement() {}
        }
    }
}

keep_some_fnames_reduce: {
    options = {
        reduce_vars: true,
        unused: true,
        keep_fnames: /Element$/,
    }
    mangle = {
        keep_fnames: /Element$/,
    }
    input: {
        function foo() {
            var array = [];
            function bar() {}
            array.map(bar);
            function barElement() {}
            array.map(barElement);
            var aElement = () => {};
            array.map(aElement);
            array.map(aElement);
            var bElement = function () {};
            array.map(bElement);
            array.map(bElement);
        }
    }
    expect: {
        function foo() {
            var a = [];
            a.map(function() {});
            a.map(function barElement() {});
            var aElement = () => {};
            a.map(aElement);
            a.map(aElement);
            var bElement = function () {};
            a.map(bElement);
            a.map(bElement);
        }
    }
}

keep_some_classnames: {
    mangle = {
        keep_classnames: /Element$/,
    }
    input: {
        function foo() {
            class Bar {}
            class BarElement {}
        }
    }
    expect: {
        function foo() {
            class s {}
            class BarElement {}
        }
    }
}

keep_fnames_and_avoid_collisions: {
    mangle = {
        keep_fnames: true
    }

    input: {
        global.t = 'ttttttttttttttttttttt';
        (function testBug() {
            var param1 = 'PASS'
            return () => {
                console.log(param1)
                var t = function () {};
                return t;
            };
        })()()
    }

    expect_stdout: "PASS"
}
