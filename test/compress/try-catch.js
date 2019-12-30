catch_destructuring_with_sequence: {
    beautify = {
        ecma: 2015
    }
    input: {
        try {
            throw {};
        } catch ({xCover = (0, function() {})} ) {
        }
    }
    expect_exact: "try{throw{}}catch({xCover=(0,function(){})}){}"
}

broken_safari_catch_scope: {
    mangle = {
        safari10: true,
    }
    input: {
        "AAAAAAAA";
        "BBBBBBB";
        new class {
            f(x) {
                try {
                    throw {
                        m: "PASS"
                    };
                } catch ({m: s}) {
                    console.log(s);
                }
            }
        }().f();
    }
    expect: {
        "AAAAAAAA";
        "BBBBBBB";
        new class {
            f(A) {
                try {
                    throw {
                        m: "PASS"
                    };
                } catch ({m: B}) {
                    console.log(B);
                }
            }
        }().f();
    }
    expect_stdout: "PASS"
}

broken_safari_catch_scope_caveat: {
    // The `input` of this test reportedly fails on Safari 10+ despite
    // being valid ECMAScript.
    // The `expect`ed output of this test will also fail on Safari 10+
    // despite of the `safari10` `mangle` option being enabled.
    // This test just exists to prove that both forms will run correctly
    // on ES spec compliant engines such as V8.

    mangle = {
        safari10: true,
    }
    input: {
        "AAAAAAAA";
        "BBBBBBB";
        new class {
            f(x) {
                try {
                    throw {
                        m: "PASS"
                    };
                } catch ({m: x}) {
                    console.log(x);
                }
            }
        }().f();
    }
    expect: {
        "AAAAAAAA";
        "BBBBBBB";
        new class {
            f(A) {
                try {
                    throw {
                        m: "PASS"
                    };
                } catch ({m: A}) {
                    console.log(A);
                }
            }
        }().f();
    }
    expect_stdout: "PASS"
}

parameterless_catch: {
    input: {
        try {
            unknown();
        } catch {
            console.log("PASS");
        }
    }
    expect_exact: 'try{unknown()}catch{console.log("PASS")}'
    expect_stdout: "PASS"
    node_version: ">=10"
}

parent_scope_of_catch_block_is_not_the_try_block: {
    mangle = {}
    input: {
        function test(foo, bar) {
            try {
                const bar = {};
                throw 'PASS'
            } catch (error) {
                return bar(error);
            }
        }
        console.log(test(null, x => x));
    }
    expect_stdout: "PASS"
}

issue_452: {
    options = {
        toplevel: true,
        unused: true
    }
    input: {
        try {
            const arr = ['PASS'];
            for (const x of arr) { console.log(x) }
        } catch(e) { }
    }
    expect_stdout: 'PASS'
}
