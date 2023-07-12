mangleprop_annotation: {
    options = {
        toplevel: true,
    };
    mangle = {
        properties: {
            only_annotated: true,
        },
    };
    input: {
        class Foo {
            /*@__MANGLE_PROP__*/ prop = "prop"
            /*@__MANGLE_PROP__*/ static static_prop = "static_prop"
            /*@__MANGLE_PROP__*/ meth() {return "meth"}
            /*@__MANGLE_PROP__*/ async meth2() {}
            /*@__MANGLE_PROP__*/ async *meth3() {}
            /*@__MANGLE_PROP__*/ *gen() { return "gen" }
        }

        const foo = {
            /*@__MANGLE_PROP__*/ prop: "prop",
            /*@__MANGLE_PROP__*/ meth() {return "meth"},
            /*@__MANGLE_PROP__*/ async meth2() {},
            /*@__MANGLE_PROP__*/ async *meth3() {},
            /*@__MANGLE_PROP__*/ *gen() { return "gen" },
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
        toplevel: true,
    };
    mangle = {
        properties: {
            only_annotated: true,
        },
    };
    input: {
        class Foo {
            /*@__MANGLE_PROP__*/ manglethis = "manglethis"
            manglethistoo = "manglethistoo"
            dontmanglethis = "dontmanglethis"
        }

        const foo = {
            manglethis: "manglethis",
            /*@__MANGLE_PROP__*/ manglethistoo: "manglethistoo",
            dontmanglethis: "dontmanglethis"
        }

        console.log(new Foo().manglethis, foo.manglethis);
        console.log(new Foo().manglethistoo, foo.manglethistoo);
        console.log(new Foo().dontmanglethis, foo.dontmanglethis);
    }
    expect: {
        class Foo {
            /*@__MANGLE_PROP__*/ o = "manglethis"
            t = "manglethistoo"
            dontmanglethis = "dontmanglethis"
        }

        const foo = {
            o: "manglethis",
            /*@__MANGLE_PROP__*/ t: "manglethistoo",
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
        toplevel: true,
    };
    mangle = {
        properties: {
            regex: /matchedbyregex/
        },
    };
    input: {
        class Foo {
            /*@__MANGLE_PROP__*/ manglethis = "manglethis"
            manglethistoo = "manglethistoo"
            dontmanglethis = "dontmanglethis"
            matchedbyregex = "matchedbyregex"
        }

        const foo = {
            manglethis: "manglethis",
            /*@__MANGLE_PROP__*/ manglethistoo: "manglethistoo",
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
            /*@__MANGLE_PROP__*/ o = "manglethis"
            t = "manglethistoo"
            dontmanglethis = "dontmanglethis"
            l = "matchedbyregex"
        }

        const foo = {
            o: "manglethis",
            /*@__MANGLE_PROP__*/ t: "manglethistoo",
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

mangleprop_annotation_and_key: {
    options = {
        toplevel: true,
    };
    mangle = {
        properties: { only_annotated: true },
    };
    input: {
        const object = {
            /**@__MANGLE_PROP__*/someprop: "ppppppppp",
            o: 'o',
        }

        "someprop" in object;
        /*@__KEY__*/"someprop" in object;
        object.hasOwnProperty("someprop");
        object.hasOwnProperty(/*@__KEY__*/"someprop");

        console.log(Object.values(object));
    }
    expect: {
        const object = {
            p: "ppppppppp",
            o: 'o',
        }

        "p" in object;
        /*@__KEY__*/"p" in object;
        object.hasOwnProperty("someprop");
        object.hasOwnProperty(/*@__KEY__*/"p");

        console.log(Object.values(object));
    }
    expect_stdout: true
}

mangleprop_annotation_in_propassign: {
    options = {
        toplevel: true,
    };
    mangle = {
        properties: { only_annotated: true },
    };
    input: {
        /*@__MANGLE_PROP__*/ this.keepthis.manglethis = "manglethis";
        /*@__MANGLE_PROP__*/ this.keepthis.manglethis = "manglethis";
        (/*@__MANGLE_PROP__*/ this.manglethis_).keepthis_ = "manglethis_";
        (/*@__MANGLE_PROP__*/ this.manglethis_).keepthis_ = "manglethis_";
        /*@__MANGLE_PROP__*/ this.keepthis__["manglethis__"] = "manglethis__";
        /*@__MANGLE_PROP__*/ this.keepthis__["manglethis__"] = "manglethis__";
        (/*@__MANGLE_PROP__*/ this["manglethis___"]).keepthis___ = "manglethis___";
        (/*@__MANGLE_PROP__*/ this["manglethis___"]).keepthis___ = "manglethis___";
    }
    expect: {
        this.keepthis.h = "manglethis";
        this.keepthis.h = "manglethis";
        this.i.keepthis_ = "manglethis_";
        this.i.keepthis_ = "manglethis_";
        this.keepthis__["t"] = "manglethis__";
        this.keepthis__["t"] = "manglethis__";
        this["_"].keepthis___ = "manglethis___";
        this["_"].keepthis___ = "manglethis___";
    }
}

mangleprop_annotation_in_prop: {
    options = {
        toplevel: true,
    };
    mangle = {
        properties: { only_annotated: true },
    };
    input: {
        /*@__MANGLE_PROP__*/ this.keepthis.manglethis;
    }
    expect: {
        this.keepthis.h;
    }
}
