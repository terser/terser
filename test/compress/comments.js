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
    expect: {
        var foo={};
        // this is a comment line
        (foo.bar={}).test=123;var foo2={};
        /* this is a block line */(foo2.bar={}).test=123;
    }
}
