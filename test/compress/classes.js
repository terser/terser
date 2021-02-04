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

private_class_methods: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        class A {
            #method() {
                return "PA"
            }
            static async* #method2() {
                return "S"
            }
            ["#method"]() {
                return "S"
            }
            async print() {
                console.log(this.#method() + (await A.#method2().next()).value + this["#method"]());
            }
        }
        new A().print();
    }
    expect: {
        class A {
            #method() {
                return "PA"
            }
            static async* #method2() {
                return "S"
            }
            ["#method"]() {
                return "S"
            }
            async print() {
                console.log(this.#method() + (await A.#method2().next()).value + this["#method"]());
            }
        }
        new A().print();
    }
    // expect_stdout: "PASS" // < tested in chrome, fails with nodejs 14 (current LTS)
}

private_class_accessors: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        class A {
            #accessorInternal = "FAIL"
            get #accessor() {
                return this.#accessorInternal
            }
            set #accessor(v) {
                this.#accessorInternal = v;
            }
            static get #accessor2() {
                return "S"
            }
            get ["#accessor"]() {
                return "S"
            }
            async print() {
                this.#accessor = "PA"
                console.log(this.#accessor + A.#accessor2 + this["#accessor"]);
            }
        }
        new A().print();
    }
    expect: {
        class A {
            #accessorInternal = "FAIL"
            get #accessor() {
                return this.#accessorInternal
            }
            set #accessor(v) {
                this.#accessorInternal = v;
            }
            static get #accessor2() {
                return "S"
            }
            get ["#accessor"]() {
                return "S"
            }
            async print() {
                this.#accessor = "PA"
                console.log(this.#accessor + A.#accessor2 + this["#accessor"]);
            }
        }
        new A().print();
    }
    // expect_stdout: "PASS" // < tested in chrome, fails with nodejs 14 (current LTS)
}
