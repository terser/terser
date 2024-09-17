variant_1: {
    options = {
        unused: true,
        evaluate: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        const A = 1, B = 0, C = 2, D = 3;

        export function f() {
            return A * (B + C + 2 * D);
        }
    }
    expect: {
        export function f() {
            return 8;
        }
    }
}

variant_2: {
    options = {
        unused: true,
        evaluate: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        const A = 1, B = 0, C = 2, D = 3;

        export function f() {
            return A * (B + C + 2 * D);
        }

        export default function () { return f; }
    }
    expect: {
        export function f() {
            return 8;
        }

        export default function () { return f; }
    }
}

variant_3: {
    options = {
        unused: true,
        evaluate: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        const A = 1, B = 0, C = 2, D = 3;

        export function f() {
            return A * (B + C + 2 * D);
        }

        export function g() { return f; }
    }
    expect: {
        export function f() {
            return 8;
        }

        export function g() { return f; }
    }
}

variant_4: {
    options = {
        unused: true,
        evaluate: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        const A = 1, B = 0, C = 2, D = 3;

        export function f() {
            return A * (B + C + 2 * D);
        }

        export default function g() { return f; }
    }
    expect: {
        export function f() {
            return 8;
        }

        export default function g() { return f; }
    }
}
