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
        console.log(new Array(12));
    }
    expect: {
        console.log([]);
        console.log([]);
        console.log([,]);
        console.log([,,,,,,,,,,,]);
        console.log(Array(12));
    }
}
