pure_function_calls: {
    options = {
        booleans: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: true,
        side_effects: true,
        unused: true,
    }
    input: {
        // pure top-level IIFE will be dropped
        // @__PURE__ - comment
        (function() {
            console.log("iife0");
        })();

        // pure top-level IIFE assigned to unreferenced var will not be dropped
        var iife1 = /*@__PURE__*/(function() {
            console.log("iife1");
            function iife1() {}
            return iife1;
        })();

        (function(){
            // pure IIFE in function scope assigned to unreferenced var will be dropped
            var iife2 = /*#__PURE__*/(function() {
                console.log("iife2");
                function iife2() {}
                return iife2;
            })();
        })();

        // comment #__PURE__ comment
        bar(), baz(), quux();
        a.b(), /* @__PURE__ */ c.d.e(), f.g();
    }
    expect: {
        var iife1 = function() {
            console.log("iife1");
            function iife1() {}
            return iife1;
        }();

        baz(), quux();
        a.b(), f.g();
    }
}

pure_function_calls_toplevel: {
    options = {
        booleans: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        // pure top-level IIFE will be dropped
        // @__PURE__ - comment
        (function() {
            console.log("iife0");
        })();

        // pure top-level IIFE assigned to unreferenced var will be dropped
        var iife1 = /*@__PURE__*/(function() {
            console.log("iife1");
            function iife1() {}
            return iife1;
        })();

        (function(){
            // pure IIFE in function scope assigned to unreferenced var will be dropped
            var iife2 = /*#__PURE__*/(function() {
                console.log("iife2");
                function iife2() {}
                return iife2;
            })();
        })();

        // pure top-level calls will be dropped regardless of the leading comments position
        var MyClass = /*#__PURE__*//*@class*/(function(){
            function MyClass() {}
            MyClass.prototype.method = function() {};
            return MyClass;
        })();

        // comment #__PURE__ comment
        bar(), baz(), quux();
        a.b(), /* @__PURE__ */ c.d.e(), f.g();
    }
    expect: {
        baz(), quux();
        a.b(), f.g();
    }
}
