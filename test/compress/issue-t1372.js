
issue_t1372_maintain_this_binding: {
    options = {
        side_effects: true,
    }
    input: {
        (function(o) {
            console.log((0, o.f)("PASS"), (0, o?.f)("PASS"));
        })({
            a: "FAIL",
            f(b) {
                return this.a || b;
            },
        });
    }
    expect: {
        (function(o) {
            console.log((0, o.f)("PASS"), (0, o?.f)("PASS"));
        })({
            a: "FAIL",
            f(b) {
                return this.a || b;
            },
        });
    }
    expect_stdout: [
        "PASS PASS",
    ]
}
