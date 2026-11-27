concat_1: {
    options = {
        evaluate: true,
    }
    input: {
        var a = "foo" + "bar" + x() + "moo" + "foo" + y() + "x" + "y" + "z" + q();
        var b = "foo" + 1 + x() + 2 + "boo";
        var c = 1 + x() + 2 + "boo";

        // this CAN'T safely be shortened to 1 + x() + "5boo"
        var d = 1 + x() + 2 + 3 + "boo";

        var e = 1 + x() + 2 + "X" + 3 + "boo";

        // be careful with concatenation with "\0" with octal-looking strings.
        var f = "\0" + 360 + "\0" + 8 + "\0";
    }
    expect: {
        var a = "foobar" + x() + "moofoo" + y() + "xyz" + q();
        var b = "foo1" + x() + "2boo";
        var c = 1 + x() + 2 + "boo";
        var d = 1 + x() + 2 + 3 + "boo";
        var e = 1 + x() + 2 + "X3boo";
        var f = "\x00360\x008\0";
    }
}

concat_2: {
    options = {}
    input: {
        console.log(
            1 + (2 + 3),
            1 + (2 + "3"),
            1 + ("2" + 3),
            1 + ("2" + "3"),
            "1" + (2 + 3),
            "1" + (2 + "3"),
            "1" + ("2" + 3),
            "1" + ("2" + "3")
        );
    }
    expect: {
        console.log(
            1 + (2 + 3),
            1 + (2 + "3"),
            1 + "2" + 3,
            1 + "2" + "3",
            "1" + (2 + 3),
            "1" + 2 + "3",
            "1" + "2" + 3,
            "1" + "2" + "3"
        );
    }
    expect_stdout: true
}

concat_3: {
    options = {}
    input: {
        console.log(
            1 + 2 + (3 + 4 + 5),
            1 + 2 + (3 + 4 + "5"),
            1 + 2 + (3 + "4" + 5),
            1 + 2 + (3 + "4" + "5"),
            1 + 2 + ("3" + 4 + 5),
            1 + 2 + ("3" + 4 + "5"),
            1 + 2 + ("3" + "4" + 5),
            1 + 2 + ("3" + "4" + "5")
        );
    }
    expect: {
        console.log(
            1 + 2 + (3 + 4 + 5),
            1 + 2 + (3 + 4 + "5"),
            1 + 2 + (3 + "4") + 5,
            1 + 2 + (3 + "4") + "5",
            1 + 2 + "3" + 4 + 5,
            1 + 2 + "3" + 4 + "5",
            1 + 2 + "3" + "4" + 5,
            1 + 2 + "3" + "4" + "5"
        );
    }
    expect_stdout: true
}

concat_4: {
    options = {}
    input: {
        console.log(
            1 + "2" + (3 + 4 + 5),
            1 + "2" + (3 + 4 + "5"),
            1 + "2" + (3 + "4" + 5),
            1 + "2" + (3 + "4" + "5"),
            1 + "2" + ("3" + 4 + 5),
            1 + "2" + ("3" + 4 + "5"),
            1 + "2" + ("3" + "4" + 5),
            1 + "2" + ("3" + "4" + "5")
        );
    }
    expect: {
        console.log(
            1 + "2" + (3 + 4 + 5),
            1 + "2" + (3 + 4) + "5",
            1 + "2" + 3 + "4" + 5,
            1 + "2" + 3 + "4" + "5",
            1 + "2" + "3" + 4 + 5,
            1 + "2" + "3" + 4 + "5",
            1 + "2" + "3" + "4" + 5,
            1 + "2" + "3" + "4" + "5"
        );
    }
    expect_stdout: true
}

concat_5: {
    options = {}
    input: {
        console.log(
            "1" + 2 + (3 + 4 + 5),
            "1" + 2 + (3 + 4 + "5"),
            "1" + 2 + (3 + "4" + 5),
            "1" + 2 + (3 + "4" + "5"),
            "1" + 2 + ("3" + 4 + 5),
            "1" + 2 + ("3" + 4 + "5"),
            "1" + 2 + ("3" + "4" + 5),
            "1" + 2 + ("3" + "4" + "5")
        );
    }
    expect: {
        console.log(
            "1" + 2 + (3 + 4 + 5),
            "1" + 2 + (3 + 4) + "5",
            "1" + 2 + 3 + "4" + 5,
            "1" + 2 + 3 + "4" + "5",
            "1" + 2 + "3" + 4 + 5,
            "1" + 2 + "3" + 4 + "5",
            "1" + 2 + "3" + "4" + 5,
            "1" + 2 + "3" + "4" + "5"
        );
    }
    expect_stdout: true
}

concat_6: {
    options = {}
    input: {
        console.log(
            "1" + "2" + (3 + 4 + 5),
            "1" + "2" + (3 + 4 + "5"),
            "1" + "2" + (3 + "4" + 5),
            "1" + "2" + (3 + "4" + "5"),
            "1" + "2" + ("3" + 4 + 5),
            "1" + "2" + ("3" + 4 + "5"),
            "1" + "2" + ("3" + "4" + 5),
            "1" + "2" + ("3" + "4" + "5")
        );
    }
    expect: {
        console.log(
            "1" + "2" + (3 + 4 + 5),
            "1" + "2" + (3 + 4) + "5",
            "1" + "2" + 3 + "4" + 5,
            "1" + "2" + 3 + "4" + "5",
            "1" + "2" + "3" + 4 + 5,
            "1" + "2" + "3" + 4 + "5",
            "1" + "2" + "3" + "4" + 5,
            "1" + "2" + "3" + "4" + "5"
        );
    }
    expect_stdout: true
}

concat_7: {
    input: {
        console.log(
            "" + 1,
            "" + "1",
            "" + 1 + 2,
            "" + 1 + "2",
            "" + "1" + 2,
            "" + "1" + "2",
            "" + (x += "foo")
        );
    }
    expect: {
        console.log(
            "" + 1,
            "1",
            "" + 1 + 2,
            1 + "2",
            "1" + 2,
            "1" + "2",
            x += "foo"
        );
    }
    expect_stdout: true
}

concat_8: {
    input: {
        console.log(
            1 + "",
            "1" + "",
            1 + 2 + "",
            1 + "2" + "",
            "1" + 2 + "",
            "1" + "2" + "",
            (x += "foo") + ""
        );
    }
    expect: {
        console.log(
            1 + "",
            "1",
            1 + 2 + "",
            1 + "2",
            "1" + 2,
            "1" + "2",
            x += "foo"
        );
    }
    expect_stdout: true
}

issue_1780: {
    options = {
        evaluate: true,
    }
    input: {
        var x = 5;
        console.log("n=" + -x + 1);
        console.log("[" + (x | 0) + 0 + "]");
        console.log("flag:" + true + 1);
        console.log("a" + undefined + 1);
    }
    expect: {
        var x = 5;
        console.log("n=" + -x + 1);
        console.log("[" + (x | 0) + "0]");
        console.log("flag:true1");
        console.log("a" + void 0 + 1);
    }
    expect_stdout: "n=-51\n[50]\nflag:true1\naundefined1"
}
