inline_identity: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = x => x;
        console.log(id(1), id(2));
    }
    expect: {
        console.log(1, 2);
    }
    expect_stdout: "1 2"
}

inline_identity_function: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        function id(x) { return x };
        console.log(id(1), id(2));
    }
    expect: {
        console.log(1, 2);
    }
    expect_stdout: "1 2"
}

inline_identity_undefined: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = x => x;
        console.log(id(), id(undefined));
    }
    expect: {
        console.log(void 0, void 0);
    }
    expect_stdout: "undefined undefined"
}

inline_identity_extra_params: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = x => x;
        console.log(id(1, console.log(2)), id(3, 4));
    }
    expect: {
        const id = x => x;
        console.log(id(1, console.log(2)), 3);
    }
    expect_stdout: ["2", "1 3"]
}

inline_identity_higher_order: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = x => x;
        const inc = x => x + 1;
        console.log(id(inc(1)), id(inc)(2));
    }
    expect: {
        const inc = x => x + 1;
        console.log(inc(1), inc(2));
    }
    expect_stdout: "2 3"
}

inline_identity_inline_function: {
    options = {
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = x => x;
        console.log(id(x => x + 1)(1), id((x => x + 1)(2)));
    }
    expect: {
        console.log(2, 3);
    }
    expect_stdout: "2 3"
}

inline_identity_duplicate_arg_var: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = x => {
            return x;
            var x;
        };
        console.log(id(1), id(2));
    }
    expect: {
        console.log(1, 2);
    }
    expect_stdout: "1 2"
}

inline_identity_inner_ref: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = a => (function() { return a; })();
        const undef = a => (a => a)();
        console.log(id(1), id(2), undef(3), undef(4));
    }
    expect: {
        console.log(1, 2, void 0, void 0);
    }
    expect_stdout: "1 2 undefined undefined"
}

inline_identity_async: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        toplevel: true
    }
    input: {
        const id = x => x;
        id(async () => await 1)();
        id(async x => await console.log(2))();
    }
    expect: {
        (async () => await 1)();
        (async x => await console.log(2))();
    }
    expect_stdout: "2"
    node_version: ">=8"
}

inline_identity_regression: {
    options = {
        defaults: true
    }
    input: {
        global.id = x => x

        const foo = ({bar}) => id(bar);

        console.log(foo({bar: 'PASS'}));
    }
    expect_stdout: "PASS"
}

inline_identity_lose_this: {
    options = {
        inline: true,
        toplevel: true,
        reduce_vars: true
    }

    input: {
        "use strict";

        const id = x => x;

        const func_bag = {
            func: function () { return this === undefined ? "PASS" : "FAIL"; }
        };

        func_bag.func2 = function () { return this === undefined ? "PASS" : "FAIL"; };

        console.log(id(func_bag.func)());
        console.log(id(func_bag.func2)());
    }

    expect: {
        "use strict";

        const id = x => x;

        const func_bag = {
            func: function () { return void 0 === this ? "PASS" : "FAIL"; }
        };

        func_bag.func2 = function () { return void 0 === this ? "PASS" : "FAIL"; };

        console.log((0, func_bag.func)());
        console.log((0, func_bag.func2)());
    }

    expect_stdout: [
        "PASS",
        "PASS"
    ]
}

inline_identity_dont_lose_this_when_arg: {
    options = {
        inline: true,
        toplevel: true,
        reduce_vars: true
    }

    input: {
        "use strict";

        const id = x => x;

        const func_bag = { leak };

        leak(id(func_bag.leak));
    }

    expect: {
        "use strict";

        const id = x => x;

        const func_bag = { leak };

        leak(func_bag.leak);
    }
}

