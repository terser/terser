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
