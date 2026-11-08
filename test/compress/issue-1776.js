issue_1776_for_let_per_iteration_binding: {
    options = {
        unused: true,
    }
    input: {
        var probe;
        for (let i = 0, _ = (probe = () => i); i < 2; i++);
        console.log(probe());
    }
    expect: {
        var probe;
        for (let i = 0, _ = (probe = () => i); i < 2; i++);
        console.log(probe());
    }
    expect_stdout: "0"
}

issue_1776_for_const_kept: {
    options = {
        unused: true,
    }
    input: {
        var probe;
        for (const i = 0, _ = (probe = () => i); ; ) {
            console.log(probe());
            break;
        }
    }
    expect: {
        var probe;
        for (const i = 0, _ = (probe = () => i); ; ) {
            console.log(probe());
            break;
        }
    }
    expect_stdout: "0"
}
