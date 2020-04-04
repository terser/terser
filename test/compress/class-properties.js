basic_class_properties: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        class A {
            static foo
            bar
            static fil
            = "P"
            another =
            "A";
            //#private;
            //#private2 = "SS";
            toString() {
                if ('bar' in this && 'foo' in A) {
                    return A.fil + this.another// + this.#private2
                }
            }
        }
        console.log(new A().toString())
    }
    expect_stdout: "PA" // SS"
}

computed_class_properties: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        const x = "FOO"
        const y = "BAR"
        class X {
            [x] = "PASS"
            static [y]
        }
        if ("BAR" in X) {
            console.log(new X()[x])
        }
    }
    expect_stdout: "PASS"
}

static_class_properties_side_effects: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        class A {
            foo = console.log("PASS2")
            static bar = console.log("PASS1");
        }
        new A();
    }
    expect_stdout: [
        "PASS1",
        "PASS2"
    ]
}

class_expression_properties_side_effects: {
    no_mozilla_ast = true;
    node_version = ">=12"
    options = {
        side_effects: true,
        unused: true,
    }
    input: {
        global.side = () => { console.log("PASS") };
        (class {
            static foo = side();
            [side()]() {};
            [side()] = 4
        });
    }
    expect: {
        global.side = () => { console.log("PASS") };
        side(),side(),side();
    }
    expect_stdout: [
        "PASS",
        "PASS",
        "PASS"
    ]
}

class_expression_not_constant: {
    no_mozilla_ast = true;
    node_version = ">=12"
    options = {
        collapse_vars: true,
        join_vars: true,
        properties: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        const obj = {};
        leak();
        obj.Class1 = class { static foo = leak() };
        obj.Class2 = class extends Obj.Class1 {};
        new obj.Class2();
    }
    expect: {
        const obj = {} // Class1 not inlined into object
        leak();
        obj.Class1 = class { static foo = leak() };
        obj.Class2 = class extends Obj.Class1 {};
        new obj.Class2;
    }
}

class_expression_constant: {
    no_mozilla_ast = true;
    node_version = ">=12"
    options = {
        collapse_vars: true,
        join_vars: true,
        properties: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        const obj = {};
        obj.Class1 = class { static foo = "constant" };
        obj.Class2 = class extends Obj.Class1 {};
        new obj.Class2();
    }
    expect: {
        const obj = { Class1: class { static foo = "constant" } };
        obj.Class2 = class extends Obj.Class1 {};
        new obj.Class2();
    }
}

static_property_side_effects: {
    no_mozilla_ast = true;
    node_version = ">=12";
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        let x = "FAIL"
        class cls {
            static [x = "PASS"]
        }
        console.log(x)
        class cls2 {
            static [console.log("PASS")]
        }
    }
    expect_stdout: ["PASS", "PASS"]
}

static_means_execution: {
    no_mozilla_ast = true
    node_version = ">=12"
    options = {
        toplevel: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        let x = 0;
        class NoProps { }
        class WithProps {
            prop = (x = x === 1 ? "PASS" : "FAIL")
        }
        class WithStaticProps {
            static prop = (x = x === 0 ? 1 : "FAIL")
        }

        new NoProps();
        new WithProps();
        new WithStaticProps();

        console.log(x);
    }
    expect: {
        let x = 0;
        // Does not get inlined as it contains an immediate side effect
        class WithStaticProps {
            static prop = (x = 0 === x ? 1 : "FAIL")
        }
        new class {};
        new class {
            prop = (x = 1 === x ? "PASS" : "FAIL")
        };
        new WithStaticProps();

        console.log(x);
    }
    expect_stdout: "PASS"
}

mangle_class_properties: {
    no_mozilla_ast = true;
    node_version = ">=12"
    mangle = {
        properties: {}
    }
    input: {
        class Foo {
            bar = "bar";
            static zzz = "zzz"
            toString() {
                return this.bar + Foo.zzz;
            }
        }
    }
    expect: {
        class Foo {
            t = "bar";
            static o = "zzz"
            toString() {
                return this.t + Foo.o;
            }
        }
    }
}

mangle_class_properties_keep_quoted: {
    no_mozilla_ast = true;
    node_version = ">=12"
    mangle = {
        properties: {
            keep_quoted: true
        }
    }
    input: {
        class Foo {
            "bar" = "bar";
            static "zzz" = "zzz"
            toString() {
                return this.bar + Foo.zzz;
            }
        }
    }
    expect: {
        class Foo {
            "bar" = "bar";
            static "zzz" = "zzz"
            toString() {
                return this.bar + Foo.zzz;
            }
        }
    }
}
