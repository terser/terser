
import_meta_basic: {
    options = { defaults: true }
    input: {
        import.meta
        import.meta.something
        import.meta?.something
        import.meta.url.includes()
    }
    expect: {
        import.meta,
        import.meta.something,
        import.meta,
        import.meta.url.includes()
    }
}

propmangle: {
    mangle = {
        properties: {
            keep_quoted: "strict",
            undeclared: true,
            debug: true,
        }
    }
    input: {
        import.meta
        import.meta.prop1
        import.meta["kept"]
    }
    expect: {
        import.meta
        import.meta._$prop1$_
        import.meta["kept"]
    }
}

pure_getters: {
    options = {
        defaults: true,
        pure_getters: true,
        unused: false,
    }
    input: {
        import.meta
    }
    expect: {
        import.meta
    }
}

global_defs: {
    options = {
        global_defs: {
            "import.meta.LIT": 123,
            "@import.meta.OBJ": "{'hello': 123}",
            "@import.meta.FUNC": "() => false"
        }
    }
    input: {
        import.meta;
        leak(import.meta.LIT)
        leak(import.meta.OBJ)
        leak(import.meta.FUNC)
    }
    expect: {
        import.meta;
        leak(123);
        leak({hello: 123});
        leak(() => false);
    }
}

global_defs_whole: {
    options = {
        defaults: true,
        global_defs: {
            "import.meta": {
                url: "http://example.com",
            },
        }
    }
    input: {
        console.log(import.meta.url);
    }
    expect: {
        console.log("http://example.com");
    }
}
