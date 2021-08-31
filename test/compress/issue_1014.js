ternary_and_private_fields: {
    no_mozilla_ast = true;
    node_version = ">=12"
    options = {
        conditionals: true,
    }
    input: {
        class A {
            #fail = false;
            #pass = "PASS";
            print() {
                console.log(this.#fail ? this.#fail : this.#pass);
            }
        }
        new A().print();
    }
    expect: {
        class A {
            #fail = false;
            #pass = "PASS";
            print() {
                console.log(this.#fail ? this.#fail : this.#pass);
            }
        }
        new A().print();
    }
    expect_stdout: "PASS"
}

ternary_and_private_public_fields: {
    no_mozilla_ast = true;
    node_version = ">=12"
    options = {
        conditionals: true,
    }
    input: {
        class A {
            fail = false;
            #pass = "PASS";
            print() {
                console.log(this.fail ? this.fail : this.#pass);
            }
        }
        new A().print();
    }
    expect: {
        class A {
            fail = false;
            #pass = "PASS";
            print() {
                console.log(this.fail ? this.fail : this.#pass);
            }
        }
        new A().print();
    }
    expect_stdout: "PASS"
}

ternary_and_private_methods: {
    no_mozilla_ast = true;
    node_version = ">=12"
    options = {
        conditionals: true,
    }
    input: {
        class A {
            #fail() { return false; }
            get #pass() { return "PASS"; }
            print() {
                console.log(this.#fail() ? this.#fail() : this.#pass);
            }
        }
        new A().print();
    }
    expect: {
        class A {
            #s() { return false; }
            get #i() { return "PASS"; }
            print() {
                console.log(this.#s() ? this.#s() : this.#i);
            }
        }
        new A().print();
    }
    expect_stdout: "PASS"
}

ternary_and_private_static_fields: {
    no_mozilla_ast = true;
    node_version = ">=12"
    options = {
        conditionals: true,
    }
    input: {
        class A {
            static #fail = false;
            static #pass = "PASS";
            print() {
                console.log(A.#fail ? A.#fail : A.#pass);
            }
        }
        new A().print();
    }
    expect: {
        class A {
            static #fail = false;
            static #pass = "PASS";
            print() {
                console.log(A.#fail ? A.#fail : A.#pass);
            }
        }
        new A().print();
    }
    expect_stdout: "PASS"
}


