optional_chaining_boolean_expr: {
    options = {
        booleans: true,
        ecma: true,
    }
    input: {
        (function(option) {
            if (!(option.container?.tagName === "DIV"))
                throw new Error("Invalid `container` and/or `viewer` option.");
        })()
    }
    expect: {
        (function(option) {
            if (option.container?.tagName !== "DIV")
                throw new Error("Invalid `container` and/or `viewer` option.");
        })()
    }
}