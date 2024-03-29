regexp_simple: {
    input: {
        /rx/ig
    }
    expect_exact: "/rx/gi;"
}

regexp_slashes: {
    input: {
        /\\\/rx\/\\/ig
    }
    expect_exact: "/\\\\\\/rx\\/\\\\/gi;"
}

regexp_1: {
    options = {
    }
    input: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(/([Sap]+)/ig)));
    }
    expect: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(/([Sap]+)/gi)));
    }
    expect_stdout: '["PASS","pass"]'
}

regexp_2: {
    options = {
        evaluate: true,
        unsafe: true,
    }
    input: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(new RegExp("(pass)", "ig"))));
    }
    expect: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(/(pass)/gi)));
    }
    expect_stdout: '["PASS","pass"]'
}

unsafe_slashes: {
    options = {
        defaults: true,
        unsafe: true
    }
    input: {
        console.log(new RegExp("^https//"))
    }
    expect: {
        console.log(/^https\/\//)
    }
}
unsafe_nul_byte: {
    options = {
        defaults: true,
        unsafe: true
    }
    input: {
        console.log(new RegExp("\0"))
    }
    expect: {
        console.log(/\0/)
    }
}

double_escape: {
    format = {
        ascii_only: true
    }
    input: {
        /\🏳0\🌈️\☺/
    }
    expect: {
        /\ud83c\udff30\ud83c\udf08\ufe0f\u263a/
    }
    expect_stdout: true
}

inline_script: {
    options = {}
    beautify = {
        inline_script: true,
        comments: "all"
    }
    input: {
        /* </script> */
        /[</script>]/
    }
    expect_exact: '/* <\\/script> */\n/[<\\/script>]/;'
}

regexp_no_ddos: {
    options = { unsafe: true, evaluate: true }
    input: {
        console.log(/(b+)b+/.test("bbb"))
        console.log(RegExp("(b+)b+").test("bbb"))
    }
    expect: {
        console.log(/(b+)b+/.test("bbb"))
        console.log(RegExp("(b+)b+").test("bbb"))
    }
    expect_stdout: ["true", "true"]
}
