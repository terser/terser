assign_and_inline: {
    options = {
        toplevel: true,
        defaults: true,
    }
    input: {
        class MyClass {
          method(a1) {
           myPureFunction(a1)
          }
        }

        function myPureFunction (a) {
         console.log(a)
        }

        new MyClass();
    }
    expect: {
        new class{method(a1) {var a;a=a1,console.log(a)}};
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
          }
        }

        function myPureFunction (a) {
         console.log(a)
        }

        new MyClass();
    }
    expect: {
        new class{method(a1) {console.log(a1)}};
    }
}

rename_and_inline: {
    options = {
        toplevel: true,
        defaults: true,
        pure_getters: true
    }
    input: {
        class MyClass {
          method(a) {
           myPureFunction(a)
          }
        }

        function myPureFunction (a) {
         console.log(a)
        }

        new MyClass();
    }
    expect: {
        new class{method(a) {console.log(a)}};
    }
}
