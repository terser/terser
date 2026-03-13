issue_1443_pure_builtins: {
    options = {
        unused: true,
        builtins_ecma: 2015,
        builtins_pure: true,
        toplevel: true,
        passes: 2,
    }
    input: {
        // kept
        const keep1 = new Map(side_effect_iterable);
        const keep2 = new Array(maybe_nan);
        const keep3 = encodeURI("might throw URIError");
        class keep4 extends UnknownGlobal { }
        const keep5 = Math.f16round(); // ES2026
        const keep6 = Promise.resolve()
        // dropped
        const drop1 = isFinite(1234);
        const drop2 = new Array();
        const drop3 = new Map();
        const drop4 = new Set();
        const drop5 = Math.acos();
    }
    expect: {
        new Map(side_effect_iterable);
        new Array(maybe_nan);
        encodeURI("might throw URIError");
        UnknownGlobal;
        Math.f16round();
        Promise.resolve()
    }
}

pure_builtins_globalthis: {
    options = {
        unused: true,
        builtins_ecma: 2020,
        builtins_pure: true,
        toplevel: true,
        passes: 2,
    }
    input: {
        const drop1 = globalThis.isFinite(1234);
        const drop2 = new globalThis.Array();
        const drop3 = new globalThis.Map();
        const drop4 = new globalThis.Set();
        const drop5 = globalThis.Math.acosh();
    }
    expect: {
    }
}
