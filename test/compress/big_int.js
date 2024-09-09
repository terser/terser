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
    no_mozilla_ast: true
}

regression_big_int_hex_lower_with_e: {
    input: {
        0xaefen;
    }
    expect_exact: "0xaefen;"
    no_mozilla_ast: true
}

big_int_binary: {
    input: {
        0b101n
    }
    expect_exact: "0b101n;"
    no_mozilla_ast: true
}

big_int_octal: {
    input: {
        0o7n
    }
    expect_exact: "0o7n;"
    no_mozilla_ast: true
}

big_int_no_e: {
    bad_input: `1e3n`
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid or unexpected token"
    })
}

big_int_bad_digits_for_base: {
    bad_input: `0o9n`
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid or unexpected token"
    })
}

big_int_math: {
    options = {
        defaults: true
    }
    input: {
        console.log({
            sum: 10n + 15n,
            exp: 2n ** 3n,
            sub: 1n - 3n,
            mul: 5n * 5n,
            div: 15n / 5n,
        });
    }
    expect_exact: "console.log({sum:25n,exp:8n,sub:-2n,mul:25n,div:3n});"
    expect_stdout: true
}

big_int_math_counter_examples: {
    node_version = ">= 12"
    options = {
        defaults: true
    }
    input: {
        console.log({
            mixing_types: 1 * 10n,
            bad_shift: 1n >>> 0n,
            bad_div: 1n / 0n,
        });
    }
    expect_exact: "console.log({mixing_types:1*10n,bad_shift:1n>>>0n,bad_div:1n/0n});"
    expect_stdout: true
}
