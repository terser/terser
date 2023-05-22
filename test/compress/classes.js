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

        class d {
            dee = d;
        }

        class e {
            static eee = e;
        }
    }
    expect: { }
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

export_default_class_expr: {
    options = {
        defaults: true,
        module: true
    }

    input: {
        export default class extends Foo { }
    }

    expect: {
        export default class extends Foo { }
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

class_static_blocks: {
    node_version = ">=16"
    input: {
        class A {
            static {
                this.hello = 'PASS'
            }
            print() {
                console.log(A.hello)
            }
        }
        new A().print();
        console.log(A.hello + "2");
    }
    expect: {
        class A {
            static {
                this.hello = 'PASS'
            }
            print() {
                console.log(A.hello)
            }
        }
        new A().print();
        console.log(A.hello + "2");
    }
    expect_stdout: ["PASS", "PASS2"]
}

class_static_blocks_empty: {
    node_version = ">=16"
    options = { toplevel: true, defaults: true }
    input: {
        class EmptyBlock {
            static {
                1 + 1
            }
        }
    }
    expect: { }
}

class_static_not_empty_blocks: {
    node_version = ">=16"
    options = { toplevel: true, defaults: true }
    input: {
        class EmptyBlock {
            static {
                this.PASS = "PASS"
                console.log(this.PASS)
            }
        }
        console.log(EmptyBlock.PASS)
    }
    expect_stdout: ["PASS", "PASS"]
}

class_static_block_pinned: {
    node_version = ">=16"
    options = { toplevel: true, defaults: true }
    input: {
        const x = "PASS";
        class X {
            static {
                console.log(x);
            }
        }

        console.log(X);
    }
    expect: {
        class X {
            static {
                console.log("PASS");
            }
        }

        console.log(X);
    }
    expect_stdout: true
}

class_static_block_hoisting: {
    node_version = ">=16"
    options = { toplevel: true, defaults: true }
    input: {
        var y = "PASS";

        class A {
          static field = "FAIL";
          static {
            var y = this.field;
          }
        }

        console.log(y);
    }
    expect_stdout: "PASS"
}

class_static_block_scope_2: {
    node_version = ">=16"
    options = { toplevel: true, defaults: true }
    input: {
        var y = "PASS";
        class A {
            static {
                var y = "FAIL";
            }

            static {
                console.log(y)
            }
        }
        console.log(y);
    }
    expect_stdout: ["PASS", "PASS"]
}
