replace_index: {
    options = {
        arguments: true,
        evaluate: true,
        properties: true,
    }
    input: {
        var arguments = [];
        console.log(arguments[0]);
        (function() {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function(a, b) {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function(arguments) {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function() {
            var arguments;
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
    }
    expect: {
        var arguments = [];
        console.log(arguments[0]);
        (function() {
            console.log(arguments[1], arguments[1], arguments.foo);
        })("bar", 42);
        (function(a, b) {
            console.log(b, b, arguments.foo);
        })("bar", 42);
        (function(arguments) {
            console.log(arguments[1], arguments[1], arguments.foo);
        })("bar", 42);
        (function() {
            var arguments;
            console.log(arguments[1], arguments[1], arguments.foo);
        })("bar", 42);
    }
    expect_stdout: [
        "undefined",
        "42 42 undefined",
        "42 42 undefined",
        "a a undefined",
        "42 42 undefined",
    ]
}

replace_index_strict: {
    options = {
        arguments: true,
        evaluate: true,
        properties: true,
        reduce_vars: true,
    }
    input: {
        "use strict";
        (function() {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function(a, b) {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
    }
    expect: {
        "use strict";
        (function() {
            console.log(arguments[1], arguments[1], arguments.foo);
        })("bar", 42);
        (function(a, b) {
            console.log(b, b, arguments.foo);
        })("bar", 42);
    }
    expect_stdout: [
        "42 42 undefined",
        "42 42 undefined",
    ]
}

replace_index_keep_fargs: {
    options = {
        arguments: true,
        evaluate: true,
        keep_fargs: false,
        properties: true,
    }
    input: {
        var arguments = [];
        console.log(arguments[0]);
        (function() {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function(a, b) {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function(arguments) {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function() {
            var arguments;
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
    }
    expect: {
        var arguments = [];
        console.log(arguments[0]);
        (function(argument_0, argument_1) {
            console.log(argument_1, argument_1, arguments.foo);
        })("bar", 42);
        (function(a, b) {
            console.log(b, b, arguments.foo);
        })("bar", 42);
        (function(arguments) {
            console.log(arguments[1], arguments[1], arguments.foo);
        })("bar", 42);
        (function() {
            var arguments;
            console.log(arguments[1], arguments[1], arguments.foo);
        })("bar", 42);
    }
    expect_stdout: [
        "undefined",
        "42 42 undefined",
        "42 42 undefined",
        "a a undefined",
        "42 42 undefined",
    ]
}

replace_index_keep_fargs_strict: {
    options = {
        arguments: true,
        evaluate: true,
        keep_fargs: false,
        properties: true,
        reduce_vars: true,
    }
    input: {
        "use strict";
        (function() {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
        (function(a, b) {
            console.log(arguments[1], arguments["1"], arguments["foo"]);
        })("bar", 42);
    }
    expect: {
        "use strict";
        (function(argument_0, argument_1) {
            console.log(argument_1, argument_1, arguments.foo);
        })("bar", 42);
        (function(a, b) {
            console.log(b, b, arguments.foo);
        })("bar", 42);
    }
    expect_stdout: [
        "42 42 undefined",
        "42 42 undefined",
    ]
}

modified: {
    options = {
        arguments: true,
    }
    input: {
        (function(a, b) {
            var c = arguments[0];
            var d = arguments[1];
            var a = "foo";
            b++;
            arguments[0] = "moo";
            arguments[1] *= 2;
            console.log(a, b, c, d, arguments[0], arguments[1]);
        })("bar", 42);
    }
    expect: {
        (function(a, b) {
            var c = a;
            var d = b;
            var a = "foo";
            b++;
            a = "moo";
            b *= 2;
            console.log(a, b, c, d, a, b);
        })("bar", 42);
    }
    expect_stdout: "moo 86 bar 42 moo 86"
}

modified_strict: {
    options = {
        arguments: true,
        reduce_vars: true,
    }
    input: {
        "use strict";
        (function(a, b) {
            var c = arguments[0];
            var d = arguments[1];
            var a = "foo";
            b++;
            arguments[0] = "moo";
            arguments[1] *= 2;
            console.log(a, b, c, d, arguments[0], arguments[1]);
        })("bar", 42);
    }
    expect: {
        "use strict";
        (function(a, b) {
            var c = arguments[0];
            var d = arguments[1];
            var a = "foo";
            b++;
            arguments[0] = "moo";
            arguments[1] *= 2;
            console.log(a, b, c, d, arguments[0], arguments[1]);
        })("bar", 42);
    }
    expect_stdout: "foo 43 bar 42 moo 84"
}

arguments_in_arrow_func_1: {
    options = {
        arguments: true,
        evaluate: true,
        keep_fargs: false,
        properties: true,
    }
    input: {
        (function(a, b) {
            console.log(arguments[0], a, arguments[1], arguments[3], b, arguments[2]);
        })("bar", 42, false);
        (function(a, b) {
            (() => {
                console.log(arguments[0], a, arguments[1], arguments[3], b, arguments[2]);
            })(10, 20, 30, 40);
        })("bar", 42, false);
    }
    expect: {
        (function(a, b, argument_2, argument_3) {
            console.log(a, a, b, argument_3, b, argument_2);
        })("bar", 42, false);
        (function(a, b) {
            (() => {
                console.log(arguments[0], a, arguments[1], arguments[3], b, arguments[2]);
            })(10, 20, 30, 40);
        })("bar", 42, false);
    }
    expect_stdout: [
        "bar bar 42 undefined 42 false",
        "bar bar 42 undefined 42 false",
    ]
}

arguments_in_arrow_func_2: {
    options = {
        arguments: true,
        evaluate: true,
        keep_fargs: true,
        properties: true,
    }
    input: {
        (function(a, b) {
            console.log(arguments[0], a, arguments[1], arguments[3], b, arguments[2]);
        })("bar", 42, false);
        (function(a, b) {
            (() => {
                console.log(arguments[0], a, arguments[1], arguments[3], b, arguments[2]);
            })(10, 20, 30, 40);
        })("bar", 42, false);
    }
    expect: {
        (function(a, b) {
            console.log(a, a, b, arguments[3], b, arguments[2]);
        })("bar", 42, false);
        (function(a, b) {
            (() => {
                console.log(arguments[0], a, arguments[1], arguments[3], b, arguments[2]);
            })(10, 20, 30, 40);
        })("bar", 42, false);
    }
    expect_stdout: [
        "bar bar 42 undefined 42 false",
        "bar bar 42 undefined 42 false",
    ]
}

arguments_and_destructuring_1: {
    options = {
        arguments: true,
        defaults: true,
    }
    input: {
        (function({d}) {
            console.log(a = "foo", arguments[0].d);
        })({ d: "Bar" });
    }
    expect: {
        !function({d: d}) {
            console.log(a = "foo", arguments[0].d);
        }({ d: "Bar" });
    }
    expect_stdout: "foo Bar"
}

arguments_and_destructuring_2: {
    options = {
        arguments: true,
        defaults: true,
    }
    input: {
        (function(a, {d}) {
            console.log(a = "foo", arguments[0]);
        })("baz", { d: "Bar" });
    }
    expect: {
        !function(a, {d: d}) {
            console.log(a = "foo", arguments[0]);
        }("baz", { d: "Bar" });
    }
    expect_stdout: "foo baz"
}

arguments_and_destructuring_3: {
    options = {
        arguments: true,
        defaults: true,
    }
    input: {
        (function({d}, a) {
            console.log(a = "foo", arguments[0].d);
        })({ d: "Bar" }, "baz");
    }
    expect: {
        !function({d: d}, a) {
            console.log(a = "foo", arguments[0].d);
        }({ d: "Bar" }, "baz");
    }
    expect_stdout: "foo Bar"
}

duplicate_parameter_with_arguments: {
    options = {
        arguments: true,
        defaults: true,
    }
    input: {
        (function(a, a) {
            console.log(a = "foo", arguments[0]);
        })("baz", "Bar");
    }
    expect: {
        !function(a, a) {
            console.log(a = "foo", arguments[0]);
        }("baz", "Bar");
    }
    expect_stdout: "foo baz"
}

issue_687: {
    options = {
        defaults: true,
        toplevel: true
    }

    input: {
        function shouldBePure() {
            return arguments.length
        }
        shouldBePure();
    }
    expect: {
        // *Poof!*
    }
}
