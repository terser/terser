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
