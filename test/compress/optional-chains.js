issue_1586_optional_chain_inlined: {
    options = {
        module: true,
        inline: true,
        unused: true,
        reduce_vars: true,
    }
    input: {
        const fn = () => (foo(), bar())
        obj = {
            prop: fn?.(),
        }
    }
    expect: {
        obj = {
            prop: (foo(), bar()),
        }
    }
}

issue_1586_optional_chain_inlined_2: {
    options = {
        inline: true,
    }
    input: {
        obj = {
            prop: (() => (foo(), bar()))?.(),
        }
    }
    expect: {
        obj = {
            prop: (foo(), bar()),
        }
    }
}

issue_1400_multiple_optional_calls_on_undefined: {
    rename = true
    options = {
        defaults: true,
        module: true,
        ecma: 2021,
        passes: 4,
    }
    mangle = {}
    input: {
        const DEV_MODE = false;
        const debugLog = DEV_MODE ? (v) => console.log(v) : undefined;

        debugLog?.("one");
        debugLog?.("two");
        debugLog?.("three");
    }
    expect: {}
}

issue_1400_optional_call_arguments_not_evaluated: {
    rename = true
    options = {
        defaults: true,
        module: true,
        ecma: 2021,
        passes: 4,
    }
    mangle = {}
    input: {
        const maybeLog = undefined;

        maybeLog?.(console.log("FAIL"));
        maybeLog?.(console.log("FAIL"));
        console.log("PASS");
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
    node_version = ">=14"
}
