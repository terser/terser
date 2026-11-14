instanceof_non_constructor_throw: {
    options = {
        side_effects: true,
    }
    input: {
        try {
            [] instanceof async function() {};
        } catch (e) {
            console.log("caught");
        }
    }
    expect: {
        try {
            [] instanceof async function() {};
        } catch (e) {
            console.log("caught");
        }
    }
    expect_stdout: "caught"
}

instanceof_hasinstance_side_effect: {
    options = {
        side_effects: true,
    }
    input: {
        var obj = {
            [Symbol.hasInstance](value) {
                console.log("hasInstance");
                return false;
            }
        };
        [] instanceof obj;
    }
    expect: {
        var obj = {
            [Symbol.hasInstance](value) {
                console.log("hasInstance");
                return false;
            }
        };
        [] instanceof obj;
    }
    expect_stdout: "hasInstance"
}

in_operator_throw: {
    options = {
        side_effects: true,
    }
    input: {
        try {
            1 in 1;
        } catch (e) {
            console.log("caught");
        }
    }
    expect: {
        try {
            1 in 1;
        } catch (e) {
            console.log("caught");
        }
    }
    expect_stdout: "caught"
}
