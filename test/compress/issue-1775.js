let_undefined_prefix_increment: {
    options = {
        defaults: true,
    }
    input: {
        function m() {
            let w = undefined;
            ++w;
            return w;
        }
        console.log(m());
    }
    expect: {
        function m() {
            return NaN;
        }
        console.log(m());
    }
    expect_stdout: "NaN"
}

let_void_0_postfix_decrement: {
    options = {
        defaults: true,
    }
    input: {
        function m() {
            let w = void 0;
            w--;
            return w;
        }
        console.log(m());
    }
    expect: {
        function m() {
            return NaN;
        }
        console.log(m());
    }
    expect_stdout: "NaN"
}

let_void_0_compound_assignment: {
    options = {
        defaults: true,
    }
    input: {
        function m() {
            let w = void 0;
            w += 1;
            return w;
        }
        console.log(m());
    }
    expect: {
        function m() {
            let w;
            return w += 1, NaN;
        }
        console.log(m());
    }
    expect_stdout: "NaN"
}
