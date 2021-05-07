assign_and_inline: {
    options = {
        toplevel: true,
        defaults: true,
    }
    input: {
        class MyClass {
          method(a1) {
           myPureFunction(a1)
           return a1 + 2
          }
        }

        function myPureFunction (a) {
         console.log(a)
        }

        new MyClass();
    }
    expect: {
        new class{method(a1) {var a;return a=a1,console.log(a),a1+2}};
    }
}

inline_different_name: {
    options = {
        toplevel: true,
        defaults: true,
        pure_getters: true
    }
    input: {
        class MyClass {
          method(a1) {
           myPureFunction(a1)
           return a1 + 2
          }
        }

        function myPureFunction (a) {
         console.log(a)
        }

        new MyClass();
    }
    expect: {
        new class{method(a1) {return console.log(a1),a1+2}};
    }
}

rename_and_inline: {
    options = {
        toplevel: true,
        defaults: true,
        pure_getters: false // TODO This even works without pure getters which is not consistent with the previous test
    }
    input: {
        class MyClass {
          method(a) {
           myPureFunction(a)
           return a + 2
          }
        }

        function myPureFunction (a) {
         console.log(a)
        }

        new MyClass();
    }
    expect: {
        new class{method(a) {return console.log(a),a+2}};
    }
}
