
missing_loop_body: {
    input: `
        for (;;)
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: eof (undefined)",
        line: 3,
        col: 4
    })
}

decrement_constant_number: {
    input: `
        5--
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid use of -- operator",
        line: 2,
        col: 9
    })
}

assign_to_call: {
    input: `
        Math.random() /= 2
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid assignment",
        line: 2,
        col: 22
    })
}

increment_this: {
    input: `
        ++this
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid use of ++ operator",
        line: 2,
        col: 8
    })
}

increment_null: {
    input: `
        ++null
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid use of ++ operator",
        line: 2,
        col: 8
    })
}

invalid_dot: {
    input: `
        a.=
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: operator (=)",
        line: 2,
        col: 10
    })
}

invalid_percent: {
    input: `
        %.a;
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: operator (%)",
        line: 2,
        col: 8
    })
}

invalid_divide: {
    input: `
        a./()
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: operator (/)",
        line: 2,
        col: 10
    })
}

invalid_object_key: {
    input: `
        x({%: 1})
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: operator (%)",
        line: 2,
        col: 11
    })
}

invalid_const: {
    input: `
        const a
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Missing initializer in const declaration",
        line: 3,
        col: 4
    })
}

invalid_delete: {
    input: `
        function f(x) {
            delete 42;
            delete (0, x);
            delete null;
            delete x;
        }

        function g(x) {
            "use strict";
            delete 42;
            delete (0, x);
            delete null;
            delete x;
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Calling delete on expression not allowed in strict mode",
        line: 14,
        col: 19
    })
}

invalid_arguments: {
    input: `
        function x() {
            "use strict"
            function a(arguments) { }
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected arguments identifier as parameter inside strict mode",
        line: 4,
        col: 23
    })
}

invalid_eval: {
    input: `
        function x() {
            "use strict"
            function eval() { }
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected eval in strict mode",
        line: 4,
        col: 21
    })
}

invalid_iife: {
    input: `
        function x() {
            "use strict"
            !function arguments() {

            }()
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected arguments in strict mode",
        line: 4,
        col: 22
    })
}

invalid_catch_eval: {
    input: `
        function x() {
            "use strict"
            try {
                
            } catch (eval) {
                
            }
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected eval identifier as parameter inside strict mode",
        line: 6,
        col: 21
    })
}

invalid_var_eval: {
    input: `
        function x() {
            "use strict"
            var eval
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected eval in strict mode",
        line: 4,
        col: 16
    })
}

invalid_else: {
    input: `
        if (0) else 1
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: keyword (else)",
        line: 2,
        col: 15
    })
}

invalid_return: {
    input: `
        return 42
    `
    expect_error: ({
        name: "SyntaxError",
        message: "'return' outside of function",
        line: 2,
        col: 8
    })
}

export_anonymous_class: {
    input: `
        export class {}
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: punc ({)",
        line: 2,
        col: 21
    })
}

export_anonymous_function: {
    input: `
        export function () {}
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: punc (()",
        line: 2,
        col: 24
    })
}

spread_in_sequence: {
    input: `
        (a, ...b)
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token: expand (...)",
        line: 2,
        col: 12
    })
}

invalid_for_in: {
    input: `
        for (1, 2, a in b) { }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid left-hand side in for..in loop",
        line: 2,
        col: 13
    })
}

invalid_for_in_var: {
    input: `
        for (var a, b in c) { }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Only one variable declaration allowed in for..in loop",
        line: 2,
        col: 13
    })
}

big_int_decimal: {
    input: `
        .23n
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid or unexpected token",
        line: 2,
        col: 8
    })
}

big_int_scientific_format: {
    input: `
        1e3n
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid or unexpected token",
        line: 2,
        col: 8
    })
}
