// Import/export
import "mod-name";
import Imp from "bar";
import * as Imp2 from "food"
import { Imp3, Imp4 } from "lel";
import Imp5, { Imp6 } from "lel";
import { outer as Imp7, outer2 as Imp8 } from "lel";
import("a.js");

let A1, A2, A3, A4, A5
let B1, B2, B3, B4, B5
export default x;
export const z = 4;
export function fun() {}
export {A2 as a, B2 as b};
export {A3};
export * from "a.js";
export * as foo from "a.js";
export {A} from "a.js";
export {A4, B4} from "a.js";
export {};

const x = 0b01;
let y = 6;
let bools = [true, false];
let bigints = [100n, 100_0n, -10n]
import.meta;
console.log(import.meta.url);
y ** 2;
y **= 2;

(a, [b], {c:foo = 3}, d = 4, ...e) => null;
() => {};

async function f() { }
function*gen() {
    yield 1;
    yield* 2;
}
async function*async_gen() {
    yield 1;
    yield* 2;
    await 3;
}

class Class extends Object {
    constructor(...args) {
        super.init(args);
    }
    foo() {}
}

x = class {
    static staticMethod() {}
    static get foo() {}
    static set bar(value) {}
    get x() {}
    set x(value) {}
    static() {
        // "static" can be a method name!
    }
    get() {
        // "get" can be a method name!
    }
    async set() {
        // "set" can be a method name!
    }
    *bar() {}
    static *baz() {}
    *["constructor"]() {}
    static ["constructor"]() {}
    [a]() {}
    ""(){}
    "string"(){}
    "%"(){}
    ["%"](){}
    1(){}

    property
    valued_property = 1
    [computed_property] = 2
    static static_property = 3
    static [computed_static_property] = 4
    #private_property = 5
    static #private_static_property = 6
    get #private_getter() {}
    set #private_setter(value) {}
    #private_method() {}
    static #private_static_method() {}

    static {
        this.#private_static_property = 7;
        #private_static_property in this;
    }

    "string property"
    "valued string property" = 9
    "" = 10
    11 = "number property"
    // TODO Terser can't preserve .raw here
    // 12n = "bigint property"
}

y = {
    get x() {},
    set x(value) {},
    bar() {},
    *bar() {},
    *["constructor"]() {},
}

function f2 () {
    console.log(new.target);
}
var f3 = function f3 () {
    x()
}
console.log([10, ...[], 20, ...[30, 40], 50]["length"]);
var { w: w1, ...V } = { w: 7, x: 1, y: 2 };
for (const x of y) {}
async () => {
    for await (const x of y) {}
}

const logicalExpression = 1 || 2;

``;
`x`;
`x${1}`;
String.raw`\n`;

// arrow.js

var foo = ([]) => "foo";
var bar = ({}) => "bar";
var with_default = (foo = "default") => foo;
var object_with_default = ({foo = "default", bar: baz = "default"}) => foo;
var array_after_spread = (...[foo]) => foo;
var array_after_spread = (...{foo}) => foo;
var computed = ({ [compute()]: x }) => {};
var array_hole = ([, , ...x] = [1, 2]) => {};
var object_trailing_elision = ({foo,}) => {};
var spread_empty_array = (...[]) => "foo";
var spread_empty_object = (...{}) => "foo";

// async.js

async (x) => await x

// destructuring.js

var [aa, bb] = cc;
var [aa, [bb, cc]] = dd;
var [,[,,,,,],,,zz,] = xx; // Trailing comma
var [,,zzz,,] = xxx; // Trailing comma after hole

var {aa, bb} = {aa:1, bb:2};
var {aa, bb: {cc, dd}} = {aa:1, bb: {cc:2, dd: 3}};

for (const [x,y] in pairs);
for (const [a] = 0;;);
for (const {c} of cees);

// destructuring-expressions.js

;([x.y] = z)
;([x.y = 3] = z)
;({ [x.y = 3]: y } = z)
;({ _, ...x.y } = z)

// object.js

var a = {
    get,
    set: "foo",
    get bar() {
        return this.get;
    },
    get 5() {
        return "five";
    },
    /* TODO We don't preserve "raw"
    get 0x55() {
        return "f five five";
    },
    */
    get "five"() {
        return 5;
    },
    get ""() {
        return "";
    },
    set one(value) {
        this._one = value;
    },
    set 9(value) {
        this._nine = value;
    },
    /* TODO We don't preserve "raw"
    set 0b1010(value) {
        this._ten = value;
    },
    */
    set "eleven"(value) {
        this._eleven = value;
    },
    set ""(value) {
        this[""] = value
    },
    *"%"() {
        return 2;
    },
    *["%"]() {
        return 2;
    },
    a() {},
    [a]() {},
    "": a,
    ""() { },
     "a"() { },
    [""]() { },
    "a": a,
    0: 1,
    // Too large to be represented as a raw number
    "9999999999999999": 1,
};

// RegExp literals

console.log(/rx/gi.test("RX"));
/rx1/;
/\/rx2\//gi;
/\\rx3\\/gi;
/[\\/]/gi;
/[\\/]/;

// Nullish coalescing
hello?.foo?.["bar"]?.baz?.() ?? "default";

// Conditional assignments
a ||= b;
a &&= b;
a ??= b;

// try..catch
try { x() } catch(e) {}
try { x() } catch(e) {} finally {}
try { x() } catch {}
try { x() } catch({ message }) {}

function statements() {
    // with (x()) { y() }
    while (x()) { y(); continue; break }
    do  { y() } while (x())
    for (let x = 1; x < 10; x++) { y() }
    return x()
    throw y()
    labeled: x()
    labeled_loop: while (0) {
        break labeled_loop; break;
    }
    anon_blocks: { x() }; { y() }
    switch (x) {
        case "a":
            x()
        case b:
            y()
            break
        default:
            z()
    }
    debugger;
}

function other_expressions() {
    foo ? bar() : baz();
    [
        1,
        , // hole
        2,
    ];
    var numbers = [Infinity, -Infinity, NaN]
    new SomeClass(a, b, ...c)
    null;
    (seq, uence);
    var strings = ["", "'", "str", "str\0ing"]
    ++i; i++;
    undefined;
}

// ASM.js
function uses_asm() {
    "use asm";
    0.0;
    function f() {
        0.0;
        (function() {0.0})
    }
    0.0;
}

