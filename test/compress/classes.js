class_recursive_refs: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        class a {
          set() {
            class b {
              set [b] (c) {}
            }
          }
        }

        class b {
            constructor() {
                b();
            }
        }

        class c {
            [c] = 42;
        }
    }
    expect: {
        
    }
}

class_duplication: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        class Foo {
            foo() {
                leak(new Foo())
            }
        }

        // Export the class.
        export default Foo;
    }
    expect: {
        class Foo {
            foo() {
                leak(new Foo())
            }
        }

        // Export the class.
        export default Foo;
    }
}

class_duplication_2: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        class Foo {
            foo() {
                leak(new Foo())
            }
        }

        leak(Foo);
    }
    expect: {
        class Foo {
            foo() {
                leak(new Foo())
            }
        }

        leak(Foo);
    }
}

pure_prop_assignment_for_classes: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        class A {}
        A.staticProp = "A"

        class B {
            static get danger() { }
        }
        B.staticProp = ""
    }
    expect: { }
}
