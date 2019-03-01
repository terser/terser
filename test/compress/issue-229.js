template_strings: {
    input: {
        var x = {};
        var y = {...x};
        y.hello = 'world';
    }
    expect_exact: "var x={};var y={...x};y.hello=\"world\";"
}