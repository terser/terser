inline_string_keep_quoted_strict: {
    options = {
        defaults: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let quoted_obj = {
            '_obj_prop': 'bar',
            '_obj_method'() {},
            get '_obj_getter'() {},
        };
        let quoted_static_class = class {
            static '_static_prop' = 'bar';
            static '_static_method'() {}
            static get '_static_getter'() {}
        };
        let quoted_instance_class = class {
            '_instance_prop' = 'bar';
            '_instance_method'() {}
            get '_instance_getter'() {}
        };
        global['_sub'];
        global?.['_optional_sub'];
        global?.deep['_deep_optional_sub'];
        let { '_destructure': quoted_destructure } = global;

        let obj = {
            _obj_prop: 'bar',
            _obj_method() {},
            get _obj_getter() {},
        };
        let static_class = class {
            static _static_prop = 'bar';
            static _static_method() {}
            static get _static_getter() {}
        };
        let instance_class = class {
            _instance_prop = 'bar';
            _instance_method() {}
            get _instance_getter() {}
        };
        global._sub;
        global?._optional_sub;
        global?.deep._deep_optional_sub;
        let { _destructure: destructure } = global;
    }
    expect: {
        let quoted_obj = {
            '_obj_prop': 'bar',
            '_obj_method'() {},
            get '_obj_getter'() {},
        };
        let quoted_static_class = class {
            static '_static_prop' = 'bar';
            static '_static_method'() {}
            static get '_static_getter'() {}
        };
        let quoted_instance_class = class {
            '_instance_prop' = 'bar';
            '_instance_method'() {}
            get '_instance_getter'() {}
        };
        global['_sub'];
        global?.['_optional_sub'];
        global?.deep['_deep_optional_sub'];
        let { '_destructure': quoted_destructure } = global;

        let obj = {
            t: "bar",
            _() {},
            get l() {}
        };
        let static_class = class {
            static o = "bar";
            static i() {}
            static get p() {}
        };
        let instance_class = class {
            u = "bar";
            j() {}
            get h() {}
        };
        global._sub;
        global?._optional_sub;
        global?.deep._deep_optional_sub;
        let { m: destructure } = global;
    }
}

computed_inline_string_keep_quoted_strict_no_computed_props: {
    options = {
        defaults: false,
        computed_props: false,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let quoted_obj = {
            ['_obj_prop']: 'bar',
            ['_obj_method']() {},
            get ['_obj_getter']() {},
        };
        let quoted_static_class = class {
            static ['_static_prop'] = 'bar';
            static ['_static_method']() {}
            static get ['_static_getter']() {}
        };
        let quoted_instance_class = class {
            ['_instance_prop'] = 'bar';
            ['_instance_method']() {}
            get ['_instance_getter']() {}
        };
        global['_sub'];
        global?.['_optional_sub'];
        global?.deep['_deep_optional_sub'];
        let { ['_destructure']: quoted_destructure } = global;

        let obj = {
            _obj_prop: 'bar',
            _obj_method() {},
            get _obj_getter() {},
        };
        let static_class = class {
            static _static_prop = 'bar';
            static _static_method() {}
            static get _static_getter() {}
        };
        let instance_class = class {
            _instance_prop = 'bar';
            _instance_method() {}
            get _instance_getter() {}
        };
        global._sub;
        global?._optional_sub;
        global?.deep._deep_optional_sub;
        let { _destructure: destructure } = global;
    }
    expect: {
        let quoted_obj = {
            ['_obj_prop']: 'bar',
            ['_obj_method']() {},
            get ['_obj_getter']() {},
        };
        let quoted_static_class = class {
            static ['_static_prop'] = 'bar';
            static ['_static_method']() {}
            static get ['_static_getter']() {}
        };
        let quoted_instance_class = class {
            ['_instance_prop'] = 'bar';
            ['_instance_method']() {}
            get ['_instance_getter']() {}
        };
        global['_sub'];
        global?.['_optional_sub'];
        global?.deep['_deep_optional_sub'];
        let { ['_destructure']: quoted_destructure } = global;

        let obj = {
            t: "bar",
            _() {},
            get l() {}
        };
        let static_class = class {
            static o = 'bar';
            static i() {}
            static get p() {}
        };
        let instance_class = class {
            u = 'bar';
            j() {}
            get h() {}
        };
        global._sub;
        global?._optional_sub;
        global?.deep._deep_optional_sub;
        let { m: destructure } = global;
    }
}

computed_inline_string_keep_quoted_strict_computed_props: {
    options = {
        defaults: false,
        computed_props: true,
    }
    mangle = {
        properties: {
            keep_quoted: 'strict',
        },
    }
    input: {
        let quoted_obj = {
            ['_obj_prop']: 'bar',
            ['_obj_method']() {},
            get ['_obj_getter']() {},
        };
        let quoted_static_class = class {
            static ['_static_prop'] = 'bar';
            static ['_static_method']() {}
            static get ['_static_getter']() {}
        };
        let quoted_instance_class = class {
            ['_instance_prop'] = 'bar';
            ['_instance_method']() {}
            get ['_instance_getter']() {}
        };
        global['_sub'];
        global?.['_optional_sub'];
        global?.deep['_deep_optional_sub'];
        let { ['_destructure']: quoted_destructure } = global;

        let obj = {
            _obj_prop: 'bar',
            _obj_method() {},
            get _obj_getter() {},
        };
        let static_class = class {
            static _static_prop = 'bar';
            static _static_method() {}
            static get _static_getter() {}
        };
        let instance_class = class {
            _instance_prop = 'bar';
            _instance_method() {}
            get _instance_getter() {}
        };
        global._sub;
        global?._optional_sub;
        global?.deep._deep_optional_sub;
        let { _destructure: destructure } = global;
    }
    expect: {
        let quoted_obj = {
            _obj_prop: 'bar',
            _obj_method() {},
            get _obj_getter() {},
        };
        let quoted_static_class = class {
            static _static_prop = 'bar';
            static _static_method() {}
            static get _static_getter() {}
        };
        let quoted_instance_class = class {
            _instance_prop = 'bar';
            _instance_method() {}
            get _instance_getter() {}
        };
        global['_sub'];
        global?.['_optional_sub'];
        global?.deep['_deep_optional_sub'];
        let { _destructure: quoted_destructure } = global;

        let obj = {
            t: "bar",
            _() {},
            get l() {}
        };
        let static_class = class {
            static o = "bar";
            static i() {}
            static get p() {}
        };
        let instance_class = class {
            u = "bar";
            j() {}
            get h() {}
        };
        global._sub;
        global?._optional_sub;
        global?.deep._deep_optional_sub;
        let { m: destructure } = global;
    }
}
