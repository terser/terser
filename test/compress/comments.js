print_every_comment_only_once: {
    beautify = {
      comments: true
    }
    input: {
        var foo = {};
        // this is a comment line
        (foo.bar = {}).test = 123;
        var foo2 = {};
        /* this is a block line */
        (foo2.bar = {}).test = 123;
    }
    expect_exact: [
        "var foo={};",
        "// this is a comment line",
        "(foo.bar={}).test=123;var foo2={};",
        "/* this is a block line */(foo2.bar={}).test=123;",
    ]
}

preserve_comments_by_default: {
    beautify = {
        comments: "some"
    }
    input: {
        var foo = {};
        /* @license */
        /**! foo */
        /*! foo */
        /* lost */
    }
    expect_exact: [
        "var foo={};",
        "/* @license */",
        "/**! foo */",
        "/*! foo */",
    ]
}