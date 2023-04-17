key_annotation_negative_case: {
    options = {
        defaults: false,
        inline: false,
    };
    mangle = {
        properties: true,
    };
    input: {
        function lookup(object, key) {
            return object[key];
        }
        lookup({ someprop: "bar" }, "someprop");
    }
    expect: {
        function lookup(o, p) {
            return o[p];
        }
        lookup({ o: "bar" }, "someprop");
    }
}

key_annotation_basic_use: {
    options = {
        defaults: false,
        inline: false,
    };
    mangle = {
        properties: true,
    };
    input: {
        function lookup(object, key) {
            return object[key];
        }
        lookup({ someprop: "bar" }, /*@__KEY__*/ "someprop");
    }
    expect: {
        function lookup(o,p){
            return o[p]
        }
        lookup({o:"bar"},"o");
    }
}

key_annotation_in_operator: {
    options = {
        defaults: false,
        inline: false,
    };
    mangle = {
        properties: true,
    };
    input: {
        const object = { someprop: "bar", o: true}
        "someprop" in object;
        /*@__KEY__*/ "someprop" in object;
    }
    expect: {
        const object={o:"bar", p : true};
        "o"in object;
        "o"in object;
    }
}
key_annotation_in_operator_tricky_case: {
    options = {
        defaults: false,
        inline: false,
    };
    mangle = {
        properties: true,
    };
    input: {
        // By default someprop mangles to "o", add key "o" to try and trip up the mangler
        const object = { someprop: "bar", o: true}
        "someprop" in object;
        /*@__KEY__*/ "someprop" in object;
    }
    expect: {
        const object={o:"bar", p: true};
        "o"in object;
        "o"in object;
    }
}
