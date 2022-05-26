unsafe_integer_key: {
    options = {
        evaluate: true,
        unsafe: true,
    }
    input: {
        console.log(
            ({0:1})[1] + 1,
        );
    }
    expect: {
        console.log(
            ({0:1})[1] + 1,
        );
    }
    expect_stdout: true
}
