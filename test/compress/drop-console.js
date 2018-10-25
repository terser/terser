drop_console_1: {
    options = {}
    input: {
        console.log('foo');
        console.log.apply(console, arguments);
    }
    expect: {
        console.log('foo');
        console.log.apply(console, arguments);
    }
}

drop_console_2: {
    options = {
        drop_console: true,
    }
    input: {
        console.log('foo');
        console.log.apply(console, arguments);
    }
    expect: {
        // with regular compression these will be stripped out as well
        void 0;
        void 0;
    }
}

unexpected_side_effects_dropping_console: {
    options = {
        drop_console: true,
        evaluate: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f() {
            var a = 33;
            console.log(a++);
            alert(a);
        }
    }
    expect: {
        function f() {
            alert(33);
        }
    }
}
