issue_1006: {
    options = {
        defaults: true,
    }
    input: {
        function func(foo) {
            function bar() {
                return;
            }
            let baz = foo();
            if (baz !== undefined) {
                let qux = bar(baz.qux);
            }
        }
    }
    expect: {
        function func(foo) {
            let baz = foo();
            if (void 0 !== baz) {
                baz.qux;
            }
        }
    }
}
