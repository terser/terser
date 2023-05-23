ternary_and_private_fields: {
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
            #fail() { return false; }
            get #pass() { return "PASS"; }
            print() {
                console.log(this.#fail() ? this.#fail() : this.#pass);
            }
        }
        new A().print();
    }
    expect_stdout: "PASS"
}

ternary_and_private_static_fields: {
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


