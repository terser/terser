nullish_coalescing_boolean_expr: {
    options = {
        booleans: true,
        ecma: true,
    }
    input: {
        (function(a, b) {
            if(!(a ?? b)) throw new Error("Some error");
        })()
    }
    expect: {
        (function(a, b) {
            if(!(a ?? b)) throw new Error("Some error");
        })()
    }
}