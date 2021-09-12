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
            #private;
            #private2 = "SS";
            toString() {
                if ('bar' in this && 'foo' in A) {
                    return A.fil + this.another + this.#private2
                }
            }
        }
        console.log(new A().toString())
    }
    expect_stdout: "PASS"
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

private_class_properties: {
    no_mozilla_ast = true;
    node_version = ">=12";
    options = {
        ecma: 2015
    }
    input: {
        class Foo {
            #bar = "FooBar"

            get bar() {
                return this.#bar;
            }
        }
        console.log(new Foo().bar)
    }
    expect: {
        class Foo {
            #bar = "FooBar"

            get bar() {
                return this.#bar;
            }
        }
        console.log(new Foo().bar)
    }
    expect_stdout: "FooBar"
}

same_name_public_private: {
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
            #fil;
            #another = "SS";
            ["#another"] = "XX";
            toString() {
                if ('bar' in this && 'foo' in A && !("fil" in this)) {
                    return A.fil + this.another + this.#another;
                }
            }
        }
        console.log(new A().toString())
    }
    expect_stdout: "PASS"
}

static_private_fields: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        class A {
            static #a = "P";
            b = "A";
            #c = "SS";
            toString() {
                return A.#a + this.b + this.#c;
            }
        }
        console.log(new A().toString())
    }
    expect_stdout: "PASS"
}

optional_chaining_private_fields: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        class A {
            #opt = undefined;
            toString() {
                return this?.#opt ?? "PASS";
            }
        }
        console.log(new A().toString())
    }
    expect: {
        class A {
            #opt = void 0;
            toString() {
                return this?.#opt ?? "PASS";
            }
        }
        console.log(new A().toString())
    }
    // expect_stdout: "PASS" // < tested in chrome, fails with nodejs 14 (current LTS)
}

tolerate_out_of_class_private_fields: {
    no_mozilla_ast = true;
    node_version = ">=12"
    input: {
        Bar.#foo = "bad"
    }
    expect_exact: 'Bar.#foo="bad";'
}

private_properties_can_be_mangled: {
    no_mozilla_ast = true;
    node_version = ">=12"
    mangle = {
        properties: true
    }
    input: {
        class X {
            aaaaaa = "P"
            #aaaaaa = "A"
            #bbbbbb() {
                return "SS"
            }
            get #cccccc() {}
            set #dddddd(v) {}
            log() {
                console.log(this.aaaaaa + this.#aaaaaa + this.#bbbbbb() + this.#cccccc + this.#dddddd)
            }
        }

        new X().log()
    }
    expect: {
        class X {
            t = "P"
            #a = "A"
            #s() {
                return "SS"
            }
            get #c() {}
            set #t(a) {}
            log() {
                console.log(this.t + this.#a + this.#s() + this.#c + this.#t)
            }
        }

        new X().log()
    }
}

nested_private_properties_can_be_mangled: {
    no_mozilla_ast = true;
    node_version = ">=12"
    mangle = {
        properties: true
    }
    input: {
        class X {
            #test = "PASS"
            #aaaaaa = this;
            #bbbbbb() {
                return this;
            }
            get #cccccc() { return this; }
            log() {
                console.log(this.#test);
                console.log(this.#aaaaaa.#test);
                console.log(this.#bbbbbb().#test);
                console.log(this.#cccccc.#test);
                console.log(this?.#test);
                console.log(this?.#aaaaaa.#test);
                console.log(this?.#bbbbbb().#test);
                console.log(this?.#cccccc.#test);
                console.log(this.#test);
                console.log(this.#aaaaaa?.#test);
                console.log(this.#bbbbbb?.().#test);
                console.log(this.#bbbbbb()?.#test);
                console.log(this.#cccccc?.#test);
            }
        }

        new X().log()
    }
    expect: {
        class X {
            #s = "PASS";
            #o = this;
            #t() {
                return this;
            }
            get #c() {
                return this;
            }
            log() {
                console.log(this.#s);
                console.log(this.#o.#s);
                console.log(this.#t().#s);
                console.log(this.#c.#s);
                console.log(this?.#s);
                console.log(this?.#o.#s);
                console.log(this?.#t().#s);
                console.log(this?.#c.#s);
                console.log(this.#s);
                console.log(this.#o?.#s);
                console.log(this.#t?.().#s);
                console.log(this.#t()?.#s);
                console.log(this.#c?.#s);
            }
        }
        new X().log();
    }
}
