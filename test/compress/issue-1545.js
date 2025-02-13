issue_1545: {
    options = {
        evaluate: true,
        unused: true,
        side_effects: true,
        toplevel: true, 
    }
    input: {
        console.assert(true, "This should be removed");
        console.assert(1, "This should be removed too");
        console.assert(false, "This should remain");
        console.assert(0, "This should remain as well");
    }
    expect: {
        console.assert(false, "This should remain");
        console.assert(0, "This should remain as well");
    }
}
