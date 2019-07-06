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
    }
    expect_exact: "0x20n;"
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
