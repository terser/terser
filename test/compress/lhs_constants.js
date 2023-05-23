lhs_constants: {
    options = {
        lhs_constants: true,
    }
    input: {
        function test(a, b, c, d) {
            var x;

            x = a == 42;
            x = a === 42;
            x = a != 42;
            x = a !== 42;
            x = a * 42;
            x = a & 42;
            x = a | 42;
            x = a ^ 42;

            x = a == 42n;
            x = a == "moo";
            x = a == null;

            x = a == ~42;
            x = a == void 0;
            x = a == +42;

            x = a == /moo/;

            a & 42 & 2;
            a == 42 & 2;
        }
    }
    expect: {
        function test(a, b, c, d) {
            var x;

            x = 42 == a;
            x = 42 === a;
            x = 42 != a;
            x = 42 !== a;
            x = 42 * a;
            x = 42 & a;
            x = 42 | a;
            x = 42 ^ a;

            x = 42n == a;
            x = "moo" == a;
            x = null == a;

            x = ~42 == a;
            x = void 0 == a;
            x = +42 == a;

            x = a == /moo/;

            42 & a & 2;
            42 == a & 2;
        }
    }
}
