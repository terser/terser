
window_access_is_impure: {
    options = {
        defaults: true
    }
    input: {
        try {
            window;
        } catch(e) {
            console.log("PASS");
        }
    }
    expect_stdout: "PASS"
}

globals_whose_access_is_pure: {
    options = {
        defaults: true,
    }
    input: {
        try {
            Promise;
            Number;
            Object;
            String;
            Array;
        } catch(e) {
            console.log("side effect!");
        }
    }
    expect: { }
}

