
issue_120: {
    input: {
        function f(){for(var t=o=>{var i=+o;return i+i};t(););}
    }
    expect_exact: "function f(){for(var t=o=>{var i=+o;return i+i};t(););}"
}

issue_120_2: {
    input: {
        for(var t=o=>{var i=+o;return i+i};t(););
    }
    expect_exact: "for(var t=o=>{var i=+o;return i+i};t(););"
}
