keep_imports_default: {
    options = {
        defaults: false
    }
    mangle = {
        toplevel: true,
        keep_imports: true,
    }
    input: {
        import test from 'test'
    }
    expect: {
        import test from 'test'
    }
}

keep_imports_default_wildcard: {
    options = {
        defaults: false
    }
    mangle = {
        toplevel: true,
        keep_imports: true,
    }
    input: {
        import * as alias from 'test'
    }
    expect: {
        import * as alias from 'test'
    }
}

keep_imports_named: {
    options = {
        defaults: false
    }
    mangle = {
        toplevel: true,
        keep_imports: true,
    }
    input: {
        import {test} from 'test'
    }
    expect: {
        import {test} from 'test'
    }
}

keep_imports_named_alias: {
    options = {
        defaults: false
    }
    mangle = {
        toplevel: true,
        keep_imports: true,
    }
    input: {
        import {test as alias} from 'test'
    }
    expect: {
        import {test as alias} from 'test'
    }
}

keep_imports_named_string: {
    options = {
        defaults: false
    }
    mangle = {
        toplevel: true,
        keep_imports: true,
    }
    input: {
        import {"test"} from 'test'
    }
    expect: {
        import {"test"} from 'test'
    }
}