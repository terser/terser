
missing_loop_body: {
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
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
    bad_input: `
        1e3n
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid or unexpected token",
        line: 2,
        col: 8
    })
}

invalid_privatename_in_object: {
    bad_input: `
        const myObject = {
            foo: 'bar',
            #something: 5,
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "private fields are not allowed in an object",
        line: 4,
        col: 12
    })
}

private_field_out_of_class_field: {
    bad_input: `
        function test() {
            return this.#p;
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Private field must be used in an enclosing class",
        line: 3,
        col: 24
    })
}

private_field_out_of_class_field_in_operator: {
    bad_input: `
        function test(input) {
            #p in input;
            return 10;
        }
    `
    expect_error:({
        name: "SyntaxError",
        message: "Private field must be used in an enclosing class",
        line: 3,
        col: 12
    })
}

invaild__in_operator_expression_in_class_field: {
    bad_input: `
        class A {
            #p;
            isA () {
                #p + 10;
                return this.#p;
            }
        }
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unexpected token operator «+», expected operator «in»",
        line: 5,
        col: 19
    })
}
