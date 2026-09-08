unicode_identifier_strings: {
    options = {
        defaults: true,
    }
    mangle = {}
    input: {
        var o = {};
        console.log(o["\u00c0"]);
        console.log(o["\u00e9"]);
        o["\u00c0"] = 1;
        console.log(JSON.stringify(o["\u4e2d"]));
    }
    expect: {
        var o = {};
        console.log(o.À),console.log(o.é),o.À=1,console.log(JSON.stringify(o.中));
    }
    expect_stdout: [
        "undefined",
        "undefined",
        "undefined",
    ]
}

unicode_identifier_strings_not_converted: {
    options = {
        defaults: true,
    }
    mangle = {
        reserved: [ "o" ],
    }
    input: {
        console.log(o["\u0660"]);
        console.log(o["1"]);
    }
    expect: {
        console.log(o["٠"]),console.log(o[1]);
    }
    expect_stdout: false
}

unicode_identifier_strings_property_shorter: {
    options = {
        defaults: true,
    }
    mangle = {}
    input: {
        console.log(o["\u00c1bcdefghij"]);
    }
    expect: {
        console.log(o.Ábcdefghij);
    }
    expect_stdout: false
}

unicode_identifier_ecma5: {
    options = {
        defaults: true,
    }
    mangle = {}
    input: {
        console.log(o["\u00c0"]);
    }
    expect: {
        console.log(o.À);
    }
    expect_stdout: false
}