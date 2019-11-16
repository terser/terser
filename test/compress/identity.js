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
        console.log(id(1, 2), id(3, 4));
    }
    expect: {
        console.log(1, 3);
    }
    expect_stdout: "1 3"
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
        console.log(id(inc)(1), id(inc)(2));
    }
    expect: {
        const inc = x => x + 1;
        console.log(inc(1), inc(2));
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
        }
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
        const id = a => (function () { return a })();
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