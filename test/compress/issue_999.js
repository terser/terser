switch_case_and_private_fields: {
    options = {
        switches: true,
        dead_code: true,
    }
    input: {
        class A {
            #a = "FAIL";
            #b = "PASS";

            print(variant) {
                switch (variant) {
                    case 1:
                        return this.#a;
                    case 2:
                        return this.#b;
                }
            }
        }
        console.log(new A().print(2));
    }
    expect: {
        class A {
            #a = "FAIL";
            #b = "PASS";

            print(variant) {
                switch (variant) {
                    case 1:
                        return this.#a;
                    case 2:
                        return this.#b;
                }
            }
        }
        console.log(new A().print(2));
    }
    expect_stdout: "PASS"
}
