array_constructor: {
    input: {
        console.log(new Array());
        console.log(new Array(0));
        console.log(new Array(1));
        console.log(new Array(11));
        console.log(new Array(12));
    }
    expect: {
        console.log(new Array());
        console.log(new Array(0));
        console.log(new Array(1));
        console.log(new Array(11));
        console.log(new Array(12));
    }
}

array_constructor_unsafe: {
    options = {
        unsafe: true
    }
    input: {
        console.log(new Array());
        console.log(new Array(0));
        console.log(new Array(1));
        console.log(new Array(11));
        console.log(Array(11));
        console.log(new Array(12));
        console.log(Array(12));
        console.log(new Array(foo));
        console.log(Array(foo));
        console.log(new Array("foo"));
        console.log(Array("foo"));
    }
    expect: {
        console.log([]);
        console.log([]);
        console.log([,]);
        console.log([,,,,,,,,,,,]);
        console.log([,,,,,,,,,,,]);
        console.log(Array(12));
        console.log(Array(12));
        console.log(Array(foo));
        console.log(Array(foo));
        console.log(Array("foo"));
        console.log(Array("foo"));
    }
}
