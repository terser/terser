reserved_label_repro: {
    mangle = {
        reserved: [ "DEV", "example" ],
    }
    input: {
        function example(x) {
            DEV: {
                if (x) break DEV;
                doAnExpensiveCheck();
            }
            return normalCodePath();
        }
    }
    expect: {
        function example(e) { DEV: { if (e) break DEV; doAnExpensiveCheck(); } return normalCodePath(); }
    }
    expect_stdout: false
}

reserved_label_break: {
    mangle = {
        reserved: [ "outer" ],
    }
    input: {
        var count = 5;
        outer: for (; count; count--) {
            inner: for (;;) {
                if (count === 1) break outer;
                break inner;
            }
            console.log(count);
        }
    }
    expect: {
        var count = 5;
        outer: for (; count; count--) {
            o: for (;;) {
                if (count === 1) break outer;
                break o;
            }
            console.log(count);
        }
    }
    expect_stdout: [
        "5",
        "4",
        "3",
        "2",
    ]
}

reserved_labels_both_kept: {
    mangle = {
        reserved: [ "outer", "inner" ],
    }
    input: {
        var count = 5;
        outer: for (; count; count--) {
            inner: for (;;) {
                if (count === 1) break outer;
                break inner;
            }
            console.log(count);
        }
    }
    expect: {
        var count = 5;
        outer: for (; count; count--) {
            inner: for (;;) {
                if (count === 1) break outer;
                break inner;
            }
            console.log(count);
        }
    }
    expect_stdout: [
        "5",
        "4",
        "3",
        "2",
    ]
}

unreserved_labels_still_mangle: {
    mangle = {
        reserved: [ "outer" ],
    }
    input: {
        var count = 5;
        loopMe: for (; count; count--) {
            nestedLoop: for (;;) {
                if (count === 1) break loopMe;
                break nestedLoop;
            }
            console.log(count);
        }
    }
    expect: {
        var count = 5;
        o: for (; count; count--) {
            c: for (;;) {
                if (count === 1) break o;
                break c;
            }
            console.log(count);
        }
    }
    expect_stdout: [
        "5",
        "4",
        "3",
        "2",
    ]
}