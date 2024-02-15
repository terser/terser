// https://github.com/terser/terser/issues/1478
// Tests for the lexical scope of default assignments

default_assign_scope: {
    input: {
        const exp = "PASS";

        ((easing = exp) => {
            const exp = easing;
            console.log(exp)
        })();
    }
    expect_stdout: "PASS"
}

default_assign_scope_2: {
    input: {
        const exp = "PASS";

        ((easing = exp) => {
            var exp = easing;
            console.log(exp)
        })();
    }
    expect_stdout: "PASS"
}

default_assign_scope_3: {
    input: {
        const exp = "FAIL";

        ((exp, easing = exp) => {
            var exp = easing;
            console.log(exp)
        })("PASS");
    }
    expect_stdout: "PASS"
}

default_assign_scope_4: {
    input: {
        const exp = "FAIL";

        ((exp, easing = () => exp) => {
            var exp = easing();
            console.log(exp)
        })("PASS");
    }
    expect_stdout: "PASS"
}

default_assign_scope_5: {
    input: {
        const exp = "FAIL";

        ((exp, easing = () => exp) => {
            var exp = "FAIL";
            console.log(easing())
        })("PASS");
    }
    expect_stdout: "PASS"
}

// Nightmare mode: what variable does a function in a default assignment reassign?
default_assign_scope_reassign: {
    input: {
        const exp = "FAIL";

        ((exp, easing = () => { exp = "PASS" }) => {
            easing();
            console.log(exp)
        })("FAIL");
    }
    expect_stdout: "PASS"
}

default_assign_scope_reassign_2: {
    input: {
        const exp = "FAIL";

        ((exp, easing = () => { exp = "FAIL" }) => {
            var exp = "PASS";
            easing();
            console.log(exp)
        })("FAIL");
    }
    expect_stdout: "PASS"
}

// https://github.com/mishoo/UglifyJS/issues/2662
/* TODO The binding for `var x` starts existing only at `x = 2`. Until then, reading `x` will read the argument. Probably there's no fix for this.
issue_2662: {
    input: {
        console.log((function(x, f = () => x) {
            var x;
            var y = x;
            x = 2;
            return [x, y, f()];
        })(1));
    }
    expect_stdout: "[ 2, 1, 1 ]"
}
*/

issue_2662_2: {
    input: {
        console.log((function(x, f = () => x) {
            var y = x;
            x = 2;
            return [x, y, f()];
        })(1));
    }
    expect_stdout: "[ 2, 1, 2 ]"
}
