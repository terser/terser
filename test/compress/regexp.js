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
        console.log(JSON.stringify("COMPASS? Overpass.".match(new RegExp("([Sap]+)", "ig"))));
    }
    expect: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(/([Sap]+)/gi)));
    }
    expect_stdout: '["PASS","pass"]'
}

unsafe_slashes: {
    options = {
        defaults: true,
        unsafe: true
    }
    input: {
        console.log(new RegExp("^https://"))
    }
    expect: {
        console.log(/^https:\/\//)
    }
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
