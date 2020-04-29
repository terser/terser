unicode_parse_variables: {
    options = {}
    input: {
        var a = {};
        a.你好 = 456;

        var ↂωↂ = 123;
        var l০ = 3; // 2nd char is a unicode digit
    }
    expect: {
        var a = {};
        a.你好 = 456;

        var ↂωↂ = 123;
        var l০ = 3;
    }
}

keep_quoted_unicode_props_es5: {
    beautify = { ecma: 5 }
    input: {
        console.log({ "\uA7A0": "2139" });
    }
    expect_exact: 'console.log({"Ꞡ":"2139"});'
}

unicode_escaped_identifier_2015: {
    beautify = {ecma: 2015}
    input: {
        var \u{61} = "foo";
        var \u{10000} = "bar";
    }
    expect_exact: 'var a="foo";var \u{10000}="bar";';
}

unicode_escaped_identifier_es5_as_is: {
    beautify = {ecma: 5}
    input: `
        var \u{10000} = "bar";
    `
    expect_exact: 'var \u{10000}="bar";'
}

unicode_identifier_ascii_only: {
    beautify = {ascii_only: true, ecma: 2015}
    input: {
        var \u{0061} = "hi";
        var bar = "h\u{0065}llo";
        var \u{10000} = "testing \u{101111}";
    }
    expect_exact: 'var a="hi";var bar="hello";var \\u{10000}="testing \\u{101111}";'
}

unicode_string_literals: {
    beautify = {ascii_only: true, ecma: 2015}
    input: {
        var a = "6 length unicode character: \u{101111}";
    }
    expect_exact: 'var a="6 length unicode character: \\u{101111}";'
}

check_escape_style: {
    beautify = {ascii_only: true, ecma: 2015}
    input: {
        var a = "\x01";
        var \ua0081 = "\x10"; // \u0081 only in ID_Continue
        var \u0100 = "\u0100";
        var \u1000 = "\u1000";
        var \u{10000} = "\u{10000}";
        var \u{2f800} = "\u{100000}";
    }
    expect_exact: 'var a="\\x01";var \\ua0081="\\x10";var \\u0100="\\u0100";var \\u1000="\\u1000";var \\u{10000}="\\u{10000}";var \\u{2f800}="\\u{100000}";'
}

ID_continue_with_surrogate_pair: {
    beautify = {ascii_only: true, ecma: 2015}
    input: {
        var \u{2f800}\u{2f800}\u{2f800}\u{2f800} = "\u{100000}\u{100000}\u{100000}\u{100000}\u{100000}";
    }
    expect_exact: 'var \\u{2f800}\\u{2f800}\\u{2f800}\\u{2f800}="\\u{100000}\\u{100000}\\u{100000}\\u{100000}\\u{100000}";'
}

escape_non_escaped_identifier: {
    beautify = {ascii_only: true, ecma: 2015}
    input: {
        var µþ = "µþ";
    }
    expect_exact: 'var \\u00b5\\u00fe="\\xb5\\xfe";'
}

non_escape_2_non_escape: {
    beautify = {ascii_only: false, ecma: 2015}
    input: {
        var µþ = "µþ";
    }
    expect_exact: 'var µþ="µþ";'
}

issue_2242_1: {
    beautify = {
        ascii_only: false,
    }
    input: {
        console.log("\ud83d", "\ude00", "\ud83d\ude00", "\ud83d@\ude00");
    }
    expect_exact: 'console.log("\\ud83d","\\ude00","\ud83d\ude00","\\ud83d@\\ude00");'
}

issue_2242_2: {
    beautify = {
        ascii_only: true,
    }
    input: {
        console.log("\ud83d", "\ude00", "\ud83d\ude00", "\ud83d@\ude00");
    }
    expect_exact: 'console.log("\\ud83d","\\ude00","\\ud83d\\ude00","\\ud83d@\\ude00");'
}

issue_2242_3: {
    options = {
        evaluate: false,
    }
    input: {
        console.log("\ud83d" + "\ude00", "\ud83d" + "@" + "\ude00");
    }
    expect_exact: 'console.log("\\ud83d"+"\\ude00","\\ud83d"+"@"+"\\ude00");'
}

issue_2242_4: {
    options = {
        evaluate: true,
    }
    input: {
        console.log("\ud83d" + "\ude00", "\ud83d" + "@" + "\ude00");
    }
    expect_exact: 'console.log("\ud83d\ude00","\\ud83d@\\ude00");'
}

issue_2569: {
    input: {
        new RegExp("[\udc42-\udcaa\udd74-\udd96\ude45-\ude4f\udea3-\udecc]");
    }
    expect_exact: 'new RegExp("[\\udc42-\\udcaa\\udd74-\\udd96\\ude45-\\ude4f\\udea3-\\udecc]");'
}

issue_3271: {
    input: {
        function string2buf(str) {
            var i=0,
                buf = new Array(2),
                c = str.charCodeAt(0);
            if (c < 0x800) {
                /* two byte char */
                buf[i++] = 0xC0 | (c >>> 6);
                buf[i++] = 0x80 | (c & 0x3f);
            } else {
                /* three byte char */
                buf[i++] = 0xE0 | (c >>> 12);
                buf[i++] = 0x80 | (c >>> 6 & 0x3f);
                buf[i++] = 0x80 | (c & 0x3f);
            }
            return buf;
        };
        console.log(string2buf("é"));
    }
    expect_stdout: "[ 195, 169 ]"
}
