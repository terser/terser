basic_syntax_error: {
    bad_input: `
        var x = 5--;
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid use of -- operator",
        line: 2,
        col: 17,
    })
}

invalid_template_string_example: {
    bad_input: `
        console.log(\`foo \${100 + 23}
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unterminated template",
        line: 2,
        col: 35,
    })
}
