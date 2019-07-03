issue_2038_1: {
    options = {
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export var V = 1;
        export let L = 2;
        export const C = 3;
    }
    expect: {
        export var V = 1;
        export let L = 2;
        export const C = 3;
    }
}

issue_2038_2: {
    options = {
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        let LET = 1;
        const CONST = 2;
        var VAR = 3;
        export { LET, CONST, VAR };
    }
    expect: {
        let t = 1;
        const e = 2;
        var o = 3;
        export { t as LET, e as CONST, o as VAR };
    }
}

issue_2126: {
    mangle = {
        toplevel: true,
    }
    input: {
        import { foo as bar, cat as dog } from "stuff";
        console.log(bar, dog);
        export { bar as qux };
        export { dog };
    }
    expect: {
        import { foo as o, cat as s } from "stuff";
        console.log(o, s);
        export { o as qux };
        export { s as dog };
    }
}

beautify: {
    beautify = {
        beautify: true,
    }
    input: {
        export { A as B, C as D };
    }
    expect_exact: "export { A as B, C as D };"
}

issue_2131: {
    options = {
        toplevel: true,
        unused: true,
    }
    input: {
        function no() {
            console.log(42);
        }
        function go() {
            console.log(42);
        }
        var X = 1, Y = 2;
        export function main() {
            go(X);
        };
    }
    expect: {
        function go() {
            console.log(42);
        }
        var X = 1;
        export function main() {
            go(X);
        };
    }
}

issue_2129: {
    mangle = {
        toplevel: true,
    }
    input: {
        export const { keys } = Object;
    }
    expect: {
        export const { keys } = Object;
    }
}

async_func: {
    options = {
        keep_fargs: false,
        unused: true,
    }
    input: {
        export async function Foo(x){};
    }
    expect: {
        export async function Foo(){};
    }
}

issue_2134_1: {
    options = {
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        export function Foo(x){};
        Foo.prototype = {};
    }
    expect: {
        export function Foo(){};
        Foo.prototype = {};
    }
}

issue_2134_2: {
    options = {
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        export async function Foo(x){};
        Foo.prototype = {};
    }
    expect: {
        export async function Foo(){};
        Foo.prototype = {};
    }
}

redirection: {
    mangle = {
        toplevel: true,
    }
    input: {
        let foo = 1, bar = 2;
        export { foo as delete };
        export { bar as default };
        export { foo as var } from "module.js";
    }
    expect: {
        let e = 1, o = 2;
        export { e as delete };
        export { o as default };
        export { foo as var } from "module.js";
    }
}

keyword_invalid_1: {
    input: {
        export { default };
    }
    expect: {
        export { default };
    }
}

keyword_invalid_2: {
    input: {
        export { default as Alias };
    }
    expect: {
        export { default as Alias };
    }
}

keyword_invalid_3: {
    input: {
        export { default as default };
    }
    expect: {
        export { default as default };
    }
}

keyword_valid_1: {
    input: {
        export { default } from "module.js";
    }
    expect: {
        export { default } from "module.js";
    }
}

keyword_valid_2: {
    input: {
        export { default as Alias } from "module.js";
    }
    expect: {
        export { default as Alias } from "module.js";
    }
}

keyword_valid_3: {
    input: {
        export { default as default } from "module.js";
    }
    expect: {
        export { default as default } from "module.js";
    }
}

dynamic_import: {
    mangle = {
        toplevel: true,
    }
    input: {
        import traditional from './traditional.js';
        function imp(x) {
            return import(x);
        }
        import("module_for_side_effects.js");
        let dynamic = import("some/module.js");
        dynamic.foo();
    }
    expect: {
        import o from "./traditional.js";
        function t(o) {
            return import(o);
        }
        import("module_for_side_effects.js");
        let r = import("some/module.js");
        r.foo();
    }
}

trailing_comma: {
    beautify = {
        beautify: true,
    }
    input: {
        export const a = 1;
    }
    expect_exact: "export const a = 1;"
}

export_default_anonymous_function: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default function () {
            foo();
        }
    }
    expect_exact: "export default function(){foo()}"
}

export_default_seq: {
    input: {
        export default (1, 2)
    }
    expect_exact: "export default(1,2);"
}

export_default_arrow: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default () => foo();
    }
    expect_exact: "export default()=>foo();"
}

export_default_anonymous_generator: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default function * () {
            yield foo();
        }
    }
    expect_exact: "export default function*(){yield foo()}"
}

export_default_anonymous_async_function: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default async function() {
            return await foo();
        }
    }
    expect_exact: "export default async function(){return await foo()}"
}

export_default_async_arrow_function: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default async () => await foo();
    }
    expect_exact: "export default async()=>await foo();"
}

export_default_named_generator: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        cache: {
            props: {
                $gen: "_$GEN$_",
            }
        },
        toplevel: true,
    }
    input: {
        export default function * gen() {
            yield foo();
        }
    }
    expect_exact: "export default function*_$GEN$_(){yield foo()}"
}

export_default_named_async_function: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        cache: {
            props: {
                $bar: "_$BAR$_",
            }
        },
        toplevel: true,
    }
    input: {
        export default async function bar() {
            return await foo();
        }
    }
    expect_exact: "export default async function _$BAR$_(){return await foo()}"
}

export_default_anonymous_class: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default class {
            constructor() {
                foo();
            }
        };
    }
    expect_exact: "export default class{constructor(){foo()}}"
}

export_default_anonymous_function_not_call: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default function(){}(foo);
    }
    // FIXME: should be `export default function(){};foo;`
    expect_exact: "export default(function(){}(foo));"
}

export_default_anonymous_generator_not_call: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default function*(){}(foo);
    }
    // agrees with `acorn` and `babylon 7`
    expect_exact: "export default function*(){}foo;"
}

export_default_anonymous_async_function_not_call: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        export default async function(){}(foo);
    }
    // agrees with `acorn` and `babylon 7`
    expect_exact: "export default async function(){}foo;"
}

issue_2977: {
    input: {
        export default (function () {})();
    }
    expect_exact: "export default(function(){}());"
}

name_cache_do_not_mangle_export_function_name: {
    options = {
        defaults: true,
        module: true,
    }
    mangle = {
        cache: {
            props: {
                $add: "_$ADD$_",
                $sub: "_$SUB$_",
            }
        },
        module: true,
    }
    input: {
        export function add(x, y) { return x + y; }
        function sub(x, y) { return x - y; }
        console.log(add(1, 2), add(3, 4), sub(5, 6), sub(7, 8));
    }
    expect: {
        export function add(n, d) {
            return n + d;
        }
        function _$SUB$_(n, d) {
            return n - d;
        }
        console.log(add(1, 2), add(3, 4), _$SUB$_(5, 6), _$SUB$_(7, 8));
    }
}

name_cache_do_not_mangle_export_class_name: {
    options = {
        defaults: true,
        module: true,
    }
    mangle = {
        cache: {
            props: {
                $add: "_$ADD$_",
                $sub: "_$SUB$_",
            }
        },
        module: true,
    }
    input: {
        export class add {}
        class sub {}
        console.log(add, add, sub, sub);
    }
    expect: {
        export class add {}
        class _$SUB$_ {}
        console.log(add, add, _$SUB$_, _$SUB$_);
    }
}

name_cache_do_not_mangle_export_var_name: {
    options = {
        defaults: true,
        reduce_vars: false,
        toplevel: true,
    }
    mangle = {
        cache: {
            props: {
                $add: "_$ADD$_",
                $sub: "_$SUB$_",
            }
        },
        toplevel: true,
    }
    input: {
        export var add = 1;
        var sub = 2, mul = 3;
        console.log(add, add, sub, sub, mul, mul);
    }
    expect: {
        export var add = 1;
        var _$SUB$_ = 2, d = 3;
        console.log(add, add, _$SUB$_, _$SUB$_, d, d);
    }
}

name_cache_do_not_mangle_export_let_name: {
    options = {
        defaults: true,
        reduce_vars: false,
        toplevel: true,
    }
    mangle = {
        cache: {
            props: {
                $add: "_$ADD$_",
                $sub: "_$SUB$_",
            }
        },
        toplevel: true,
    }
    input: {
        export let add = 1;
        let sub = 2, mul = 3;
        console.log(add, add, sub, sub, mul, mul);
    }
    expect: {
        export let add = 1;
        let _$SUB$_ = 2, d = 3;
        console.log(add, add, _$SUB$_, _$SUB$_, d, d);
    }
}

name_cache_do_not_mangle_export_const_name: {
    options = {
        defaults: true,
        reduce_vars: false,
        toplevel: true,
    }
    mangle = {
        cache: {
            props: {
                $add: "_$ADD$_",
                $sub: "_$SUB$_",
            }
        },
        toplevel: true,
    }
    input: {
        export const add = 1;
        const sub = 2, mul = 3;
        console.log(add, add, sub, sub, mul, mul);
    }
    expect: {
        export const add = 1;
        const _$SUB$_ = 2, d = 3;
        console.log(add, add, _$SUB$_, _$SUB$_, d, d);
    }
}

name_cache_do_not_mangle_export_destructuring_name: {
    options = {
        defaults: true,
        module: true,
    }
    mangle = {
        cache: {
            props: {
                $add: "_$ADD$_",
                $sub: "_$SUB$_",
            }
        },
        module: true,
    }
    input: {
        export const [add] = [1, 2, 3];
        const [mul, sub] = [1, 2, 3];
        console.log(add, add, sub, sub, mul, mul);
    }
    expect: {
        export const [add] = [ 1, 2, 3 ];
        const [d, _$SUB$_] = [ 1, 2, 3 ];
        console.log(add, add, _$SUB$_, _$SUB$_, d, d);
    }
}

name_cache_do_not_mangle_export_from_names: {
    options = {
        defaults: true,
        module: true,
    }
    mangle = {
        cache: {
            props: {
                $add: "_$ADD$_",
                $div: "_$DIV$_",
                $mul: "_$MUL$_",
                $divide: "_$DIVIDE$_",
                $minus: "_$MINUS$_",
                $keep: "_$KEEP$_",
            }
        },
        module: true,
    }
    input: {
        // these symbols are unrelated to the `export {} from` statement
        function add() { console.log("should be dropped"); }
        function div() { console.log("should be dropped"); }
        function mul() { console.log("should be dropped"); }
        function divide() { console.log("should be dropped"); }
        function minus() { console.log("should be dropped"); }
        function keep() { console.log("should be kept"); }

        export { add, div as divide, sub as minus, mul } from "path";
        export { keep };
    }
    expect: {
        function _$KEEP$_() { console.log("should be kept"); }
        export { add, div as divide, sub as minus, mul } from "path";
        export { _$KEEP$_ as keep };
    }
}

name_cache_mangle_export_default_class: {
    options = {
        defaults: true,
        module: true,
    }
    mangle = {
        cache: {
            props: {
                $foo: "_$FOO$_",
                $bar: "_$BAR$_",
                $baz: "_$BAZ$_",
                $qux: "_$QUX$_",
            }
        },
        module: true,
    }
    input: {
        export default class foo {}
        export class bar {}
        class baz {
            meth() {}
        }
        class qux {}
        console.log(foo, bar, baz, qux, qux);
    }
    expect: {
        export default class _$FOO$_ {}
        export class bar {}
        class _$QUX$_ {}
        console.log(_$FOO$_, bar, class {
            meth() {}
        }, _$QUX$_, _$QUX$_);
    }
}

module_mangle_export_default_class: {
    options = {
        defaults: true,
        module: true,
        passes: 3,
    }
    mangle = {
        module: true,
    }
    input: {
        export default class foo {}
        export class bar {}
        class baz { meth(){} }
        class qux {}
        console.log(foo, bar, baz, qux);
    }
    expect: {
        export default class s {}
        export class bar {}
        console.log(s, bar, class { meth(){} }, class {});
    }
}

name_cache_mangle_export_default_function: {
    options = {
        defaults: true,
        module: true,
        passes: 3,
    }
    mangle = {
        cache: {
            props: {
                $foo: "_$FOO$_",
                $bar: "_$BAR$_",
                $qux: "_$QUX$_",
            }
        },
        module: true,
    }
    input: {
        export default function foo() {
            return 1;
        }
        export function bar() {
            return 2;
        }
        function qux() {
            return 3;
        }
        console.log(foo(), bar(), qux());
    }
    expect: {
        export default function _$FOO$_() {
            return 1;
        }
        export function bar() {
            return 2;
        }
        console.log(_$FOO$_(), bar(), 3);
    }
}

module_mangle_export_default_function: {
    options = {
        defaults: true,
        module: true,
        passes: 3,
    }
    mangle = {
        module: true,
    }
    input: {
        export default function foo() {
            return 1;
        }
        export function bar() {
            return 2;
        }
        function qux() {
            return 3;
        }
        console.log(foo(), bar(), qux());
    }
    expect: {
        export default function r() {
            return 1;
        }
        export function bar() {
            return 2;
        }
        console.log(r(), bar(), 3);
    }
}

name_cache_mangle_local_import_and_export_aliases: {
    options = {
        defaults: true,
        module: true,
    }
    mangle = {
        cache: {
            props: {
                $foo: "_$FOO$_",
                $bar: "_$BAR$_",
                $qux: "_$QUX$_",
                $cat: "_$CAT$_",
                $dog: "_$DOG$_",
                $bird: "_$BIRD$_",
            }
        },
        module: true,
    }
    input: {
        import { foo as bar, cat as dog, bird } from "stuff";
        console.log(bar, dog, bird);
        export { bar as qux, dog, bird };
    }
    expect: {
        import { foo as _$BAR$_, cat as _$DOG$_, bird as _$BIRD$_ } from "stuff";
        console.log(_$BAR$_, _$DOG$_, _$BIRD$_);
        export { _$BAR$_ as qux, _$DOG$_ as dog, _$BIRD$_ as bird };
    }
}

name_cache_import_star_as_name_from_module: {
    options = {
        defaults: true,
        module: true,
    }
    mangle = {
        cache: {
            props: {
                $fs: "_$FS$_",
            }
        },
        module: true,
    }
    input: {
        import * as fs from "filesystem";
        import * as stuff from "whatever";
        fs.resolve();
        stuff.search();
        export { fs, stuff };
    }
    expect: {
        import * as _$FS$_ from "filesystem";
        import * as e from "whatever";
        _$FS$_.resolve(), e.search();
        export { _$FS$_ as fs, e as stuff };
    }
}

issue_333: {
    options = {
        collapse_vars: true,
    }
    input: {
        function shortOut() {
            return function() {};
        }

        var setToString = shortOut();

        var _setToString = setToString;

        export function baseRest() {
            return _setToString();
        }

        export { _setToString };
    }
    expect: {
        function shortOut() {
            return function () {};
        }

        var setToString = shortOut();
        var _setToString = setToString;

        export function baseRest() {
            return _setToString();
        }

        export { _setToString };
    }
}

issue_333_toplevel: {
    options = {
        defaults: true,
        toplevel: true,
    }
    input: {
        function shortOut() {
            return function() {};
        }

        var setToString = shortOut();

        var _setToString = setToString;

        export function baseRest() {
            return _setToString();
        }

        export { _setToString };
    }
    expect: {
        var _setToString = function () {};

        export function baseRest() {
            return _setToString();
        }

        export { _setToString };
    }
}
