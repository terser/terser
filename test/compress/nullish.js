
conditional_to_nullish_coalescing: {
    options = {
        ecma: 2020,
        toplevel: true,
        conditionals: true
    }

    input: {
        const foo = id('something');

        leak(foo == null ? bar : foo);
    }

    expect: {
        const foo = id('something');

        leak(foo ?? bar);
    }
}

conditional_to_nullish_coalescing_2: {
    options = {
        ecma: 2020,
        toplevel: true,
        conditionals: true
    }

    input: {
        const foo = id('something')

        console.log('negative cases')
        foo === null || foo === null ? bar : foo;
        foo === undefined || foo === undefined ? bar : foo;
        foo === null || foo === undefined ? foo : bar;
        some_global === null || some_global === undefined ? bar : some_global;

        console.log('positive cases')
        foo === null || foo === void 0 ? bar : foo;
        foo === null || foo === undefined ? bar : foo;
        foo === undefined || foo === null ? bar : foo;
    }

    expect: {
        const foo = id('something')

        console.log('negative cases')
        foo === null || foo === null ? bar : foo;
        foo === void 0 || foo === void 0 ? bar : foo;
        foo === null || foo === void 0 ? foo : bar;
        some_global === null || some_global === void 0 ? bar : some_global;

        console.log('positive cases')
        foo ?? bar;
        foo ?? bar;
        foo ?? bar;
    }
}

simplify_nullish_coalescing: {
    options = {
        ecma: 2020,
        defaults: true,
        sequences: false,
        toplevel: true
    }

    input: {
        const y = id("one")
        const is_null = null
        const not_null = "two"
        console.log(is_null ?? y);
        console.log(not_null ?? y);
    }

    expect: {
        const y = id("one")
        console.log(y)
        console.log("two")
    }

    node_version: ">=14"

    expect_stdout: [
        "one",
        "two"
    ]
}

nullish_coalescing_boolean_context: {
    options = {
        ecma: 2020,
        toplevel: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        side_effects: true,
        reduce_vars: true
    }

    input: {
        if (null ?? unknown) {
            pass()
        }

        if (unknown ?? false) {
            pass()
        }

        if (4 + 4 ?? unknown) {
            pass()
        }
    }

    expect: {
        unknown&&pass();
        unknown&&pass();
        pass();
    }
}

nullish_coalescing_mandatory_parens: {
    input: {
        (x ?? y) || z;
        x || (y ?? z);
    }

    expect_exact: "(x??y)||z;x||(y??z);"
}

nullish_coalescing_parens: {
    input: {
        console.log((false || null) ?? "PASS");
        console.log(null ?? (true && "PASS"));
        console.log((null ?? 0) || "PASS");
        console.log(null || (null ?? "PASS"));
    }

    node_version: ">=14"

    expect_stdout: [
        "PASS",
        "PASS",
        "PASS",
        "PASS",
    ]
}

delete_nullish: {
    input: {
        delete obj?.key;
        const other = { key: true };
        delete other?.key;
    }
    expect: {
        delete obj?.key;
        const other = { key: true };
        delete other?.key;
    }
}

delete_nullish_2: {
    options = {
        defaults: true,
        evaluate: true,
        passes: 3,
    }
    input: {
        delete null?.key;
        delete null?.deep.key;
        delete null.deep?.key;
        delete null?.deep?.key;
    }
    expect: {
        delete null.deep?.key;
    }
}
