computed_props_keep_quoted_inlined_sub_1: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = {
            [prop]: 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_2: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = {
            [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_3: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = {
            get [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_4: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = class {
            static [prop] = 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_5: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = class {
            static [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_6: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = class {
            static get [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_7: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = new class {
            [prop] = 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_8: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = new class {
            [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_9: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = new class {
            get [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_inlined_sub_10: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let {
            [prop]: val
        } = { [id('_foo')]: 'bar' };
        console.log(val);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_1: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = {
            [prop]: 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_2: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = {
            [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_3: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = {
            get [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_4: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = class {
            static [prop] = 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_5: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = class {
            static [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_6: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = class {
            static get [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_7: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = new class {
            [prop] = 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_8: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = new class {
            [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_9: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let o = new class {
            get [prop]() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_inlined_sub_10: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = '_foo';
        let {
            [prop]: val
        } = { [id('_foo')]: 'bar' };
        console.log(val);
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_1: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = {
            '_foo': 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_2: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = {
            '_foo'() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_3: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = {
            get '_foo'() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_4: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = class {
            static '_foo' = 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_5: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = class {
            static '_foo'() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_6: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = class {
            static get '_foo'() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_7: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = new class {
            '_foo' = 'bar'
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_8: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = new class {
            '_foo'() { return 'bar' }
        };
        console.log(o[id('_foo')]());
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_9: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let o = new class {
            get '_foo'() { return 'bar' }
        };
        console.log(o[id('_foo')]);
    }
    expect_stdout: 'bar'
}

inline_string_keep_quoted_strict_10: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let {
            '_foo': val
        } = { [id('_foo')]: 'bar' };
        console.log(val);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_strict_property_access_sub: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = 'foo_';
        let o = {
            [id('foo_')]: 'bar'
        };
        console.log(o[prop]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_strict_property_access_sub: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = 'foo_';
        let o = {
            [id('foo_')]: 'bar'
        };
        console.log(o[prop]);
    }
    expect_stdout: 'bar'
}

no_computed_props_keep_quoted_strict_optional_property_access_sub: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = 'foo_';
        let o = {
            [id('foo_')]: 'bar'
        };
        console.log(o?.[prop]);
    }
    expect_stdout: 'bar'
}

computed_props_keep_quoted_strict_optional_property_access_sub: {
    options = {
        defaults: false,
        reduce_vars: true,
        unused: true,
        toplevel: true,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let prop = 'foo_';
        let o = {
            [id('foo_')]: 'bar'
        };
        console.log(o?.[prop]);
    }
    expect_stdout: 'bar'
}
