big_int_positive: {
    input: {
        1000n
    }
    expect_exact: "1000n;"
}

big_int_negative: {
    input: {
        -15n
    }
    expect_exact: "-15n;"
}

big_int_hex: {
    input: {
        0x20n
        0xfabn
    }
    expect_exact: "0x20n;0xfabn;"
}

regression_big_int_hex_lower_with_e: {
    input: {
        0xaefen;
    }
    expect_exact: "0xaefen;"
}

big_int_binary: {
    input: {
        0b101n
    }
    expect_exact: "0b101n;"
}

big_int_octal: {
    input: {
        0o7n
    }
    expect_exact: "0o7n;"
}

big_int_no_e: {
    input: `1e3n`
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid or unexpected token"
    })
}

big_int_bad_digits_for_base: {
    input: `0o9n`
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid or unexpected token"
    })
}

big_int_math: {
    node_version = ">= 12"
    options = {
        defaults: true
    }
    input: {
        const sum = 10n + 15n;
        const exp = 5n ** 10n;
        const sub = 1n - 3n;
        const mul = 5n * 5n;
        const div = 15n / 5n;
        const regular_number = 1 * 10;
    }
    expect_exact: "const sum=10n+15n,exp=5n**10n,sub=1n-3n,mul=5n*5n,div=15n/5n,regular_number=10;"
}
