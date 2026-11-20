private_names_with_quote_keys: {
    format = {
        quote_keys: true,
    }
    input: {
        class A {
            #field = "a";
            static #static_field = "b";
            #method() { return "c"; }
            static #static_method() { return "d"; }
            async #async_method() {}
            *#generator() { yield "f"; }
            get #getter() { return "e"; }
            set #setter(v) { this.#field = v; }
            run() {
                this.#setter = this.#field + A.#static_field;
                return [
                    this.#field,
                    this.#method(),
                    A.#static_method(),
                    this.#getter,
                    [...this.#generator()].join(""),
                    #field in this,
                ].join(",");
            }
        }
        console.log(new A().run());
    }
    expect_exact: 'class A{#field="a";static#static_field="b";#method(){return"c"}static#static_method(){return"d"}async#async_method(){}*#generator(){yield"f"}get#getter(){return"e"}set#setter(v){this.#field=v}"run"(){this.#setter=this.#field+A.#static_field;return[this.#field,this.#method(),A.#static_method(),this.#getter,[...this.#generator()].join(""),#field in this].join(",")}}console.log((new A).run());'
    expect_stdout: "ab,c,d,e,f,true"
    node_version = ">=16.4"
}

private_names_with_ie8: {
    format = {
        ie8: true,
    }
    input: {
        class A {
            #class = "a";
            static #new() { return "b"; }
            get #default() { return "c"; }
            run() {
                return this.#class + A.#new() + this.#default;
            }
        }
        console.log(new A().run());
    }
    expect_exact: 'class A{#class="a";static#new(){return"b"}get#default(){return"c"}run(){return this.#class+A.#new()+this.#default}}console.log((new A).run());'
    expect_stdout: "abc"
    node_version = ">=14.6"
}
