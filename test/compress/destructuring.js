
destructuring_arrays: {
    input: {
        var [aa, bb] = cc;
    }
    expect: {
        var[aa,bb]=cc;
    }
}

destructuring_objects: {
    input: {
        var {aa, bb} = {aa:1, bb:2};
    }
    expect: {
        var{aa,bb}={aa:1,bb:2};
    }
}

destructuring_expressions: {
    input: {
        ({a, b});
        [{a}];
        f({x});
    }
    expect_exact: "({a,b});[{a}];f({x});"
}

