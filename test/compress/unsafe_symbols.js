unsafe_symbols_1: {
    options = {}
    input: {
        Symbol("kDog");
    }
    expect_exact: 'Symbol("kDog");'
}

unsafe_symbols_2: {
    options = {
        unsafe: true,
        unsafe_symbols: true
    }
    input: {
        Symbol("kDog");
    }
    expect_exact: 'Symbol();'
}