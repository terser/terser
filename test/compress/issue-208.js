do_not_update_lhs: {
    options = {
        global_defs: {
            DEBUG: 0,
        },
    }
    input: {
        DEBUG++;
        DEBUG += 1;
        DEBUG = 1;
    }
    expect: {
        DEBUG++;
        DEBUG += 1;
        DEBUG = 1;
    }
}

do_update_rhs: {
    options = {
        global_defs: {
            DEBUG: 0,
        },
    }
    input: {
        MY_DEBUG = DEBUG;
        MY_DEBUG += DEBUG;
    }
    expect: {
        MY_DEBUG = 0;
        MY_DEBUG += 0;
    }
}

mixed: {
    options = {
        evaluate: true,
        global_defs: {
            DEBUG: 0,
            ENV: 1,
            FOO: 2,
        },
    }
    input: {
        const ENV = 3;
        var FOO = 4;
        f(ENV * 10);
        --FOO;
        DEBUG = 1;
        DEBUG++;
        DEBUG += 1;
        f(DEBUG);
        x = DEBUG;
    }
    expect: {
        const ENV = 3;
        var FOO = 4;
        f(10);
        --FOO;
        DEBUG = 1;
        DEBUG++;
        DEBUG += 1;
        f(0);
        x = 0;
    }
}
