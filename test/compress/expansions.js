
expand_arguments: {
    input: {
        func(a, ...rest);
        func(...all);
    }
    expect_exact: "func(a,...rest);func(...all);"
}

expand_expression_arguments: {
    input: {
        f(...a.b);
        f(...a.b());
        f(...(a));
        f(...(a.b));
        f(...a[i]);
    }
    expect_exact: "f(...a.b);f(...a.b());f(...a);f(...a.b);f(...a[i]);"
}

expand_parameters: {
    input: {
        (function (a, ...b){});
        (function (...args){});
    }
    expect_exact: "(function(a,...b){});(function(...args){});"
}

avoid_spread_in_ternary: {
    options = {
        comparisons: true,
        conditionals: true,
        evaluate: true,
    }
    input: {
        function print(...x) {
            console.log(...x);
        }
        var a = [1, 2], b = [3, 4], m = Math;

        if (m)
            print(a);
        else
            print(b);

        if (m)
            print(...a);
        else
            print(b);

        if (m.no_such_property)
            print(a);
        else
            print(...b);
    }
    expect: {
        function print(...x) {
            console.log(...x);
        }
        var a = [ 1, 2 ], b = [ 3, 4 ], m = Math;
        print(m ? a : b);
        m ? print(...a) : print(b);
        m.no_such_property ? print(a) : print(...b);
    }
    expect_stdout: [
        "[ 1, 2 ]",
        "1 2",
        "3 4",
    ]
}

object_spread_regression: {
    options = {
        hoist_props: true
    }

    input: {
        const x = () => {
            let o = { ...{} }
        }
    }

    expect: {
        const x = () => {
            let o = {}
        }
    }
}

object_spread: {
    options = {
        defaults: true
    }
    input: {
        let obj = { ...{} }
        console.log(Object.keys(obj))
        let objWithKeys = { a: 1, ...{ b: 2 } }
        console.log(Object.keys(objWithKeys).join(","))
    }
    expect_stdout: [
        "[]",
        "a,b",
    ]
}

object_spread_constant: {
    options = {
        evaluate: false,
    }

    input: {
        id({
            ...null,
            ...undefined,
            ...true,
            ...void 0,
            ...!0,
            ...~"foo",
            .../baz/,
            ...-/baz2/,

            // Several unary prefixes
            ...!!0,
            ...~!-+0,
            ...void !1,
            ...!~"foo",
            ...+!/foo/,
            ...!!!!!!!null,
            ...!~void +-42,

            ..."bar",
        });
    }

    expect: {
        id({
            ..."bar"
        })
    }
}

// https://github.com/terser/terser/pull/1071
object_spread_inline_after_dropping_undefined: {
    input: {
        let o = { ...undefined, ...{a: true} }
        id(o);
    }

    expect: {
        let o = {a: true};
        id(o)
    }
}
object_spread_inline_after_dropping_null: {
    input: {
        let o = { ...null, ...{a: true} }
        id(o);
    }

    expect: {
        let o = {a: true};
        id(o)
    }
}


avoid_spread_hole: {
    input: {
        let x = [...[,]]
        let y = [,]
        console.log(0 in x, 0 in y)
    }

    expect_stdout: "true false"
}

avoid_spread_holes_call: {
    input: {
        let x = (a, b) => [a, b]
        let y = x(...[,], 1)
        console.log(...y)
    }

    expect_stdout: "undefined 1"
}

avoid_spread_getset_object: {
    input: {
        let x = { ...{ get x() { return 1 } } }
        let y = { ...{ set y(_) { console.log(_) } } }
        console.log(x.x, y.y, x.x = 2, y.y = 3, x.x, y.y)
    }

    expect_stdout: "1 undefined 2 3 2 3"
}

avoid_spread_this: {
    input: {
        function foo() {
            const defaults = { SS: 2 };

            return { ...this, ...defaults };
        }

        console.log(Object.keys(foo.call({ PA: 1 })));
    }

    expect_stdout: "[ 'PA', 'SS' ]"
}
