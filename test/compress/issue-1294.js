issue_1294_throwing_generator: {
    options = {
        side_effects: true,
        unsafe: false,
    }
    input: {
        try {
            [...function* () { throw 0; }()];
        } catch (e) {
            console.log(e);
        }
    }
    expect: {
        try {
            [...function* () { throw 0; }()];
        } catch (e) {
            console.log(e);
        }
    }
    expect_stdout: "0"
}

issue_1294_generator_side_effects: {
    options = {
        side_effects: true,
        unsafe: false,
    }
    input: {
        var log = [];
        [...function* () {
            log.push("iterated");
            yield 1;
        }()];
        console.log(log.join(","));
    }
    expect: {
        var log = [];
        [...function* () {
            log.push("iterated");
            yield 1;
        }()];
        console.log(log.join(","));
    }
    expect_stdout: "iterated"
}

issue_1294_evaluation_order: {
    options = {
        side_effects: true,
        unsafe: false,
    }
    input: {
        var log = [];
        function* gen() {
            log.push("gen");
            yield 1;
        }
        [1, log.push("before"), ...gen(), 2, log.push("after")];
        console.log(log.join(","));
    }
    expect: {
        var log = [];
        function* gen() {
            log.push("gen");
            yield 1;
        }
        log.push("before"), [...gen()], log.push("after");
        console.log(log.join(","));
    }
    expect_stdout: "before,gen,after"
}

issue_1294_safe_iterables_dropped: {
    options = {
        side_effects: true,
        unsafe: false,
    }
    input: {
        [...[1, 2]];
        [..."abc"];
        [...`hello`];
    }
    expect: {}
}
