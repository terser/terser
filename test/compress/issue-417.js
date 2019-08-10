test_unexpected_crash: {
    prepend_code: "x();"
    reminify: false
    input: {
        function x() {
            var getsInlined = function () {
                var leakedVariable1 = 3;
                var leakedVariable2 = 1 + 2 * leakedVariable1;

                console.log(leakedVariable1);
                console.log(leakedVariable2);
            };
            var getsDropped = getsInlined();
        }
    }
    expect_stdout: [
        "3",
        "7"
    ]
}

test_unexpected_crash_2: {
    prepend_code: "x();"
    reminify: false
    input: {
        function x() {
            var getsInlined = function () {
                var leakedVariable1 = 3;
                var leakedVariable2 = 1 + leakedVariable1[0];

                console.log(leakedVariable1);
                console.log(leakedVariable2);
            };
            var getsDropped = getsInlined();
        }
    }
    expect_stdout: [
        "3",
        "NaN"
    ]
}
