inline_identity: {
    options = {
        defaults: true,
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

inline_identity_no_params: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        const id = x => x;
        console.log(id(), id());
    }
    expect: {
        console.log(void 0, void 0);
    }
    expect_stdout: "undefined undefined"
}

inline_identity_extra_params: {
    options = {
        defaults: true,
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
        defaults: true,
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
