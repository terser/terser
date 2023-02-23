only_vars: {
    options = { join_vars: true };
    input: {
        let netmaskBinary = '';
        for (let i = 0; i < netmaskBits; ++i) {
            netmaskBinary += '1';
        }
    }
    expect: {
        let netmaskBinary = '';
        for (let i = 0; i < netmaskBits; ++i) netmaskBinary += '1';
    }
}

issue_1079_with_vars: {
    options = { join_vars: true };
    input: {
        var netmaskBinary = '';
        for (var i = 0; i < netmaskBits; ++i) {
            netmaskBinary += '1';
        }
    }
    expect: {
        for (var netmaskBinary = '', i = 0; i < netmaskBits; ++i) netmaskBinary += '1';
    }
}

issue_1079_with_mixed: {
    options = { join_vars: true };
    input: {
        var netmaskBinary = '';
        for (let i = 0; i < netmaskBits; ++i) {
            netmaskBinary += '1';
        }
    }
    expect: {
        var netmaskBinary = ''
        for (let i = 0; i < netmaskBits; ++i) netmaskBinary += '1';
    }
}

join_vars_lose_other_var: {
    options = {
        defaults: false,
        inline: true,
        reduce_vars: true,
        unused: true,
        side_effects: true,
        join_vars: true,
    }
    input: {
        global.exports = {
            set a(a) {
                console.log(a().get_b())
                const incremented = a()
                incremented.inc_b()
                console.log(incremented.get_b())
            }
        };

        (function (factory) {
            factory(exports)
        })((function (exports) {
            exports.a = function () {
                var b = "PASS",
                    _this = {};
                _this.get_b = function () {
                    return b;
                }
                _this.inc_b = function () {
                    b += "PASS";
                }
                return _this;
            };
        }));
    }
    expect_stdout: [
      "PASS",
      "PASSPASS"
    ]
}
