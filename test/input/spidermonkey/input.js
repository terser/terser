// Import/export
import "mod-name";
import Imp from "bar";
import * as Imp2 from "food"
import { Imp3, Imp4 } from "lel";
import Imp5, { Imp6 } from "lel";
import { outer as Imp7, outer2 as Imp8 } from "lel";
// TODO: import { "-" as Imp9, "*" as Imp10 } from "lel";
import("a.js");

let A1, A2, A3, A4, A5
let B1, B2, B3, B4, B5
export default x;
export const z = 4;
export function fun() {}
// TODO: export {A1 as "-", B1 as "*"};
export {A2 as a, B2 as b};
export {A3};
export * from "a.js";
export * as foo from "a.js";
export {A} from "a.js";
export {A4, B4} from "a.js";
// TODO: export {A5 as "-", B5 as "*"} from "a.js";

const x = 0b01;
let y = 6;
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
    *['constructor']() {}
    static ['constructor']() {}
    [a]() {}
    "%"(){}
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
}

y = {
    get x() {},
    set x(value) {},
    bar() {},
    *bar() {},
    *['constructor']() {}
}
function f2 () {
    console.log(new.target);
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
    get 0xf55() {
        return "f five five";
    },
    get "five"() {
        return 5;
    },
    set one(value) {
        this._one = value;
    },
    set 9(value) {
        this._nine = value;
    },
    set 0b1010(value) {
        this._ten = value;
    },
    set "eleven"(value) {
        this._eleven = value;
    },
    *"%"() {
        return 2;
    },
    *["%"]() {
        return 2;
    },
    [a]() {}
};

// RegExp literals

console.log(/rx/ig.test("RX"));
/rx1/;
/\/rx2\//ig;
/\\rx3\\/ig;
/[\\/]/ig;
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
