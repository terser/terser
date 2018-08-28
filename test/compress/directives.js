class_directives_compression: {
    options = {
        directives: true,
    }
    input: {
        class foo {
            foo() {
                "use strict";
            }
        }
    }
    expect_exact: "class foo{foo(){}}"
}

simple_statement_is_not_a_directive: {
    input: {
        "use strict"
            .split(" ")
            .forEach(function(s) {
                console.log(s);
            });
        console.log(!this); // is strict mode?
        (function() {
            "directive"
            ""
            "use strict"
            "hello world"
                .split(" ")
                .forEach(function(s) {
                    console.log(s);
                });
            console.log(!this); // is strict mode?
        })();
    }
    expect: {
        "use strict".split(" ").forEach(function(s) {
            console.log(s);
        });
        console.log(!this);
        (function() {
            "directive";
            "";
            "use strict";
            "hello world".split(" ").forEach(function(s) {
                console.log(s);
            });
            console.log(!this);
        })();
    }
    expect_stdout: [
        "use",
        "strict",
        "false",
        "hello",
        "world",
        "true",
    ]
}
