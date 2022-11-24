brackets_with_const: {
    options = {
        defaults: false,
    };
    input: {
        if (a) {
            var b;
            var c;
            const d = d();
            const e = e();
        }
    }
    expect: {
        if(a){var b;var c;const d=d();const e=e()}
    }
}

brackets_with_const_defaults: {
    options = {
        defaults: true,
    };
    input: {
        if (a) {
            var b;
            var c;
            const d = d();
            const e = e();
        }
    }
    expect: {
        if(a){var b,c;const d=d(),e=e()}
    }
}

brackets_with_const_let_mix_0: {
    options = {
        defaults: true,
    };
    input: {
        if (a) {
            var b;
            var c;
            const d = d();
            let e = e();
        }
    }
    expect: {
        if(a){var b,c;const d=d();let e=e()}
    }
}

brackets_with_const_let_mix_1: {
    options = {
        defaults: true,
    };
    input: {
        if (a) {
            let b = b();
            var c;
            var d;
            const e = e();
        }
    }
    expect: {
        if(a){let b=b();var c,d;const e=e()}
    }
}
