level_zero: {
    options = {
        keep_fnames: true,
    }
    mangle = {
        keep_fnames: true
    }
    input: {
        function f(x) {
            function n(a) {
                return a * a;
            }
            return function() {
                return x;
            };
        }
    }
    expect: {
        function f(r) {
            function n(r) {
                return r * r;
            }
            return function() {
                return r;
            };
        }
    }
}

level_one: {
    options = {
        keep_fnames: true,
    }
    mangle = {
        keep_fnames: true
    }
    input: {
        function f(x) {
            return function() {
                function n(a) {
                    return a * a;
                }
                return x(n);
            };
        }
    }
    expect: {
        function f(r) {
            return function() {
                function n(r) {
                    return r * r;
                }
                return r(n);
            };
        }
    }
}

level_two: {
    options = {
        keep_fnames: true,
    }
    mangle = {
        keep_fnames: true
    }
    input: {
        function f(x) {
            return function() {
                function r(a) {
                    return a * a;
                }
                return function() {
                    function n(a) {
                        return a * a;
                    }
                    return x(n);
                };
            };
        }
    }
    expect: {
        function f(t) {
            return function() {
                function r(t) {
                    return t * t;
                }
                return function() {
                    function n(t) {
                        return t * t;
                    }
                    return t(n);
                };
            };
        }
    }
}

level_three: {
    options = {
        keep_fnames: true,
    }
    mangle = {
        keep_fnames: true
    }
    input: {
        function f(x) {
            return function() {
                function r(a) {
                    return a * a;
                }
                return [
                    function() {
                        function t(a) {
                            return a * a;
                        }
                        return t;
                    },
                    function() {
                        function n(a) {
                            return a * a;
                        }
                        return x(n);
                    }
                ];
            };
        }
    }
    expect: {
        function f(u) {
            return function() {
                function r(u) {
                    return u * u;
                }
                return [
                    function() {
                        function t(u) {
                            return u * u;
                        }
                        return t;
                    },
                    function() {
                        function n(u) {
                            return u * u;
                        }
                        return u(n);
                    }
                ];
            };
        }
    }
}
