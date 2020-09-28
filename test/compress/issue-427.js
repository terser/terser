wrap_func_args: {
    options = {
        negate_iife: false,
    }
    beautify = {
        wrap_func_args: true,
    }
    input: {
        console.log(function() {
            return "test";
        }, () => null);
    }
    expect_exact: 'console.log((function(){return"test"}),(()=>null));'
}

no_wrap_func_args: {
    options = {
        negate_iife: false,
    }
    beautify = {
        wrap_func_args: false,
    }
    input: {
        console.log(function() {
            return "test";
        }, () => null);
    }
    expect_exact: 'console.log(function(){return"test"},()=>null);'
}
