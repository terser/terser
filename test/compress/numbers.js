hex_numbers_in_parentheses_for_prototype_functions: {
    input: {
        (-2);
        (-2).toFixed(0);

        (2);
        (2).toFixed(0);

        (0.2);
        (0.2).toFixed(0);

        (0.00000002);
        (0.00000002).toFixed(0);

        (1000000000000000128);
        (1000000000000000128).toFixed(0);
    }
    expect_exact: "-2;(-2).toFixed(0);2;2..toFixed(0);.2;.2.toFixed(0);2e-8;2e-8.toFixed(0);0xde0b6b3a7640080;(0xde0b6b3a7640080).toFixed(0);"
}

comparisons: {
    options = {
        comparisons: true,
    }
    input: {
        console.log(
            ~x === 42,
            x % n === 42
        );
    }
    expect: {
        console.log(
            42 == ~x,
            x % n == 42
        );
    }
}

evaluate_1: {
    options = {
        evaluate: true,
        unsafe_math: false,
    }
    input: {
        console.log(
            x + 1 + 2,
            x * 1 * 2,
            +x + 1 + 2,
            1 + x + 2 + 3,
            1 | x | 2 | 3,
            1 + x-- + 2 + 3,
            1 + (x*y + 2) + 3,
            1 + (2 + x + 3),
            1 + (2 + ~x + 3),
            -y + (2 + ~x + 3),
            1 & (2 & x & 3),
            1 + (2 + (x |= 0) + 3)
        );
    }
    expect: {
        console.log(
            x + 1 + 2,
            1 * x * 2,
            +x + 1 + 2,
            1 + x + 2 + 3,
            3 | x,
            1 + x-- + 2 + 3,
            x*y + 2 + 1 + 3,
            1 + (2 + x + 3),
            2 + ~x + 3 + 1,
            -y + (2 + ~x + 3),
            0 & x,
            2 + (x |= 0) + 3 + 1
        );
    }
}

evaluate_2: {
    options = {
        evaluate: true,
        unsafe_math: true,
    }
    input: {
        console.log(
            x + 1 + 2,
            x * 1 * 2,
            +x + 1 + 2,
            1 + x + 2 + 3,
            1 | x | 2 | 3,
            1 + x-- + 2 + 3,
            1 + (x*y + 2) + 3,
            1 + (2 + x + 3),
            1 & (2 & x & 3),
            1 + (2 + (x |= 0) + 3)
        );
    }
    expect: {
        console.log(
            x + 1 + 2,
            2 * x,
            3 + +x,
            1 + x + 2 + 3,
            3 | x,
            6 + x--,
            6 + x*y,
            1 + (2 + x + 3),
            0 & x,
            6 + (x |= 0)
        );
    }
}

evaluate_3: {
    options = {
        evaluate: true,
        unsafe: true,
        unsafe_math: true,
    }
    input: {
        console.log(1 + Number(x) + 2);
    }
    expect: {
        console.log(3 + +x);
    }
}

evaluate_4: {
    options = {
        evaluate: true,
    }
    input: {
        console.log(
            1+ +a,
            +a+1,
            1+-a,
            -a+1,
            +a+ +b,
            +a+-b,
            -a+ +b,
            -a+-b
        );
    }
    expect: {
        console.log(
            +a+1,
            +a+1,
            1-a,
            1-a,
            +a+ +b,
            +a-b,
            -a+ +b,
            -a-b
        );
    }
}

issue_1710: {
    options = {
        evaluate: true,
    }
    input: {
        var x = {};
        console.log((x += 1) + -x);
    }
    expect: {
        var x = {};
        console.log((x += 1) + -x);
    }
    expect_stdout: true
}

unary_binary_parenthesis: {
    input: {
        var v = [ 0, 1, NaN, Infinity, null, undefined, true, false, "", "foo", /foo/ ];
        v.forEach(function(x) {
            v.forEach(function(y) {
                console.log(
                    +(x*y),
                    +(x/y),
                    +(x%y),
                    -(x*y),
                    -(x/y),
                    -(x%y)
                );
            });
        });
    }
    expect: {
        var v = [ 0, 1, NaN, 1/0, null, void 0, true, false, "", "foo", /foo/ ];
        v.forEach(function(x) {
            v.forEach(function(y) {
                console.log(
                    +x*y,
                    +x/y,
                    +x%y,
                    -x*y,
                    -x/y,
                    -x%y
                );
            });
        });
    }
    expect_stdout: true
}

compress_numbers: {
    input: {
        const exp = 1000;
        const Exp = 1000000000000;
        const negativeExp = 0.00000001;
        const huge = 1000000000001;
        const big = 100000000001;
        const fractional = 100.2300200;
    }
    expect: {
        const exp = 1e3;
        const Exp = 1e12;
        const negativeExp = 1e-8;
        const huge = 0xe8d4a51001;
        const big = 100000000001;
        const fractional = 100.23002;
    }
}

no_number_function_transform_without_unsafe_math: {
    options = {
        unsafe: true
    }
    input: {
        Number(1234);
    }
    expect: {
        Number(1234);
    }
}

number_function_transform_with_unsafe_math: {
    options = {
        unsafe: true,
        unsafe_math: true
    }
    input: {
        Number(1234);
    }
    expect: {
        +1234;
    }
}


keep_numbers: {
    beautify = {
        keep_numbers: true
    }
    input: {
        const exp = 1000000000000;
        const negativeExp = 0.00000001;
        const huge = 1000000000001;
        const big = 100000000001;
        const fractional = 100.2300200;
        const numeric_separators = 1_000_000_000_000;
    }
    expect_exact: "const exp=1000000000000;const negativeExp=0.00000001;const huge=1000000000001;const big=100000000001;const fractional=100.2300200;const numeric_separators=1_000_000_000_000;"
}

keep_numbers_in_properties_as_is: {
    beautify = {
        keep_numbers: true
    }
    input: {
        var Foo = { 1000000: 80000000000 }
    }
    expect_exact: "var Foo={1000000:80000000000};"
}

numeric_separators: {
    input: {
        const one = 1_000;
        const two = 1_000_000;
        const bin = 0b0101_0101;
        const oct = 0o0123_4567;
        const hex = 0xDEAD_BEEF;
        const fractional = 1_000.000_100;
        const identifier = _1000;
        const negate_identifier = -_1000;
    }
    expect_exact: "const one=1e3;const two=1e6;const bin=85;const oct=342391;const hex=3735928559;const fractional=1000.0001;const identifier=_1000;const negate_identifier=-_1000;"
}

numeric_separator_trailing_underscore: {
    input: `const trailing = 1000_`
    expect_error: ({
        name: "SyntaxError",
        message: "Numeric separators are not allowed at the end of numeric literals"
    })
}

numeric_separator_double_underscore: {
    input: `const double = 1__000`
    expect_error: ({
        name: "SyntaxError",
        message: "Only one underscore is allowed as numeric separator"
    })
}
