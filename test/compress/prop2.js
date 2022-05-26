missing_prop: {
    options = {
        inline: true,
        properties: true,
        unsafe: true,
    }
    input: {
        console.log({x: 42}.y);
    }
    expect: {
        console.log(void 0);
    }
    expect_stdout: [
        "undefined",
    ]
}

missing_prop_object_prototype_method: {
    options = {
        inline: true,
        properties: true,
        unsafe: true,
    }
    input: {
        console.log({}.toString());
    }
    expect: {
        console.log({}.toString());
    }
    expect_stdout: [
        "[object Object]",
    ]
}
