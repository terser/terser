basic_syntax_error: {
    input: `
        // notice the code is within a template string
        // as opposed to a block so that the test can
        // survive a parse error
        var x = 5--;
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Invalid use of -- operator",
        line: 5,
        col: 17,
    })
}

invalid_template_string_example: {
    input: `
        console.log(\`foo \${100 + 23}
    `
    expect_error: ({
        name: "SyntaxError",
        message: "Unterminated template",
        line: 2,
        col: 35,
    })
}
