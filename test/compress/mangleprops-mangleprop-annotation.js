mangleprop_annotation: {
    options = {
        defaults: false,
        inline: false,
    };
    mangle = {
        properties: {
            only_annotated: true,
        },
    };
    input: {
        class Foo {
            /*@__MANGLEPROP__*/ prop = "prop"
            /*@__MANGLEPROP__*/ static static_prop = "static_prop"
            /*@__MANGLEPROP__*/ meth() {return "meth"}
            /*@__MANGLEPROP__*/ async meth2() {}
            /*@__MANGLEPROP__*/ async *meth3() {}
            /*@__MANGLEPROP__*/ *gen() { return "gen" }
        }

        const foo = {
            /*@__MANGLEPROP__*/ prop: "prop",
            /*@__MANGLEPROP__*/ meth() {return "meth"},
            /*@__MANGLEPROP__*/ async meth2() {},
            /*@__MANGLEPROP__*/ async *meth3() {},
            /*@__MANGLEPROP__*/ *gen() { return "gen" },
        }

        console.log(new Foo().prop, foo.prop);
        console.log(new Foo().meth(), foo.meth());
        console.log(new Foo().gen().next().value, foo.gen().next().value);
    }
    expect_stdout: [
        "prop prop",
        "meth meth",
        "gen gen",
    ]
}

mangleprop_annotation_partial: {
    options = {
        defaults: false,
        inline: false,
    };
    mangle = {
        properties: {
            only_annotated: true,
        },
    };
    input: {
        class Foo {
            /*@__MANGLEPROP__*/ manglethis = "manglethis"
            manglethistoo = "manglethistoo"
            dontmanglethis = "dontmanglethis"
        }

        const foo = {
            manglethis: "manglethis",
            /*@__MANGLEPROP__*/ manglethistoo: "manglethistoo",
            dontmanglethis: "dontmanglethis"
        }

        console.log(new Foo().manglethis, foo.manglethis);
        console.log(new Foo().manglethistoo, foo.manglethistoo);
        console.log(new Foo().dontmanglethis, foo.dontmanglethis);
    }
    expect: {
        class Foo {
            /*@__MANGLEPROP__*/ o = "manglethis"
            t = "manglethistoo"
            dontmanglethis = "dontmanglethis"
        }

        const foo = {
            o: "manglethis",
            /*@__MANGLEPROP__*/ t: "manglethistoo",
            dontmanglethis: "dontmanglethis"
        }

        console.log(new Foo().o, foo.o);
        console.log(new Foo().t, foo.t);
        console.log(new Foo().dontmanglethis, foo.dontmanglethis);
    }
    expect_stdout: [
        "manglethis manglethis",
        "manglethistoo manglethistoo",
        "dontmanglethis dontmanglethis",
    ]
}

mangleprop_annotation_wrongregex: {
    options = {
        defaults: false,
        inline: false,
    };
    mangle = {
        properties: {
            regex: /matchedbyregex/
        },
    };
    input: {
        class Foo {
            /*@__MANGLEPROP__*/ manglethis = "manglethis"
            manglethistoo = "manglethistoo"
            dontmanglethis = "dontmanglethis"
            matchedbyregex = "matchedbyregex"
        }

        const foo = {
            manglethis: "manglethis",
            /*@__MANGLEPROP__*/ manglethistoo: "manglethistoo",
            dontmanglethis: "dontmanglethis",
            matchedbyregex: "matchedbyregex",
        }

        console.log(new Foo().manglethis, foo.manglethis);
        console.log(new Foo().manglethistoo, foo.manglethistoo);
        console.log(new Foo().dontmanglethis, foo.dontmanglethis);
        console.log(new Foo().matchedbyregex, foo.matchedbyregex);
    }
    expect: {
        class Foo {
            /*@__MANGLEPROP__*/ o = "manglethis"
            t = "manglethistoo"
            dontmanglethis = "dontmanglethis"
            l = "matchedbyregex"
        }

        const foo = {
            o: "manglethis",
            /*@__MANGLEPROP__*/ t: "manglethistoo",
            dontmanglethis: "dontmanglethis",
            l: "matchedbyregex",
        }

        console.log(new Foo().o, foo.o);
        console.log(new Foo().t, foo.t);
        console.log(new Foo().dontmanglethis, foo.dontmanglethis);
        console.log(new Foo().l, foo.l);
    }
    expect_stdout: [
        "manglethis manglethis",
        "manglethistoo manglethistoo",
        "dontmanglethis dontmanglethis",
        "matchedbyregex matchedbyregex",
    ]
}
