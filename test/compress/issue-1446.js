typeof_eq_undefined: {
    options = {
        comparisons: true,
        typeofs: true,
    }
    input: {
        var a = typeof b != "undefined";
        b = typeof a != "undefined";
        var c = typeof d.e !== "undefined";
        var f = "undefined" === typeof g;
        g = "undefined" === typeof f;
        var h = "undefined" == typeof i.j;
    }
    expect: {
        var a = typeof b != "undefined";
        b = a !== void 0;
        var c = d.e !== void 0;
        var f = "undefined" == typeof g;
        g = void 0 === f;
        var h = void 0 === i.j;
    }
}

typeof_eq_undefined_ie8: {
    options = {
        comparisons: true,
        ie8: true,
        typeofs: true,
    }
    input: {
        var a = typeof b != "undefined";
        b = typeof a != "undefined";
        var c = typeof d.e !== "undefined";
        var f = "undefined" === typeof g;
        g = "undefined" === typeof f;
        var h = "undefined" == typeof i.j;
    }
    expect: {
        var a = typeof b != "undefined";
        b = a !== void 0;
        var c =  typeof d.e != "undefined";
        var f = "undefined" == typeof g;
        g = void 0 === f;
        var h = "undefined" == typeof i.j;
    }
}

undefined_redefined: {
    options = {
        comparisons: true,
        typeofs: true,
    }
    input: {
        function f(undefined) {
            var n = 1;
            return typeof n == "undefined";
        }
    }
    expect_exact: "function f(undefined){var n=1;return n===void 0}"
}

undefined_redefined_mangle: {
    options = {
        comparisons: true,
        typeofs: true,
    }
    mangle = {}
    input: {
        function f(undefined) {
            var n = 1;
            return typeof n == "undefined";
        }
    }
    expect_exact: "function f(n){var r=1;return r===void 0}"
}
