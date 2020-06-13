import assert from "assert";
import { minify } from "../../main.js";
import { parse } from "../../lib/parse.js";
import * as AST from "../../lib/ast.js";

describe("Arrow functions", function() {
    it.skip("Should not accept spread tokens on non-last parameters or without arguments parentheses", function() {
        var tests = [
            "var a = ...a => {return a.join()}",
            "var b = (a, ...b, c) => { return a + b.join() + c}",
            "var c = (...a, b) => a.join()"
        ];
        var test = function(code) {
            return function() {
                parse(code);
            };
        };
        var error = function(e) {
            return e.message === "Unexpected token: expand (...)";
        };

        for (var i = 0; i < tests.length; i++) {
            assert.throws(test(tests[i]), error);
        }
    });
    it("Should not accept holes in object binding patterns, while still allowing a trailing elision", async function() {
        var tests = [
            "f = ({, , ...x} = [1, 2]) => {};"
        ];
        var test = function(code) {
            return function() {
                parse(code);
            };
        };
        var error = function(e) {
            return e.message === "Unexpected token: punc (,)";
        };

        for (var i = 0; i < tests.length; i++) {
            assert.throws(test(tests[i]), error);
        }
    });
    it("Should not accept newlines before arrow token", async function() {
        var tests = [
            "f = foo\n=> 'foo';",
            "f = (foo, bar)\n=> 'foo';",
            "f = ()\n=> 'foo';",
            "foo((bar)\n=>'baz';);"
        ];
        var test = function(code) {
            return function() {
                parse(code);
            };
        };
        var error = function(e) {
            return e.message === "Unexpected newline before arrow (=>)";
        };

        for (var i = 0; i < tests.length; i++) {
            assert.throws(test(tests[i]), error);
        }
    });
    it("Should not accept arrow functions in the middle or end of an expression", async function() {
        [
            "0 + x => 0",
            "0 + async x => 0",
            "typeof x => 0",
            "typeof async x => 0",
            "typeof (x) => null",
            "typeof async (x) => null",
        ].forEach(function(code) {
            assert.throws(function() {
                parse(code);
            }, function(e) {
                return /^Unexpected /.test(e.message);
            }, code);
        });
    });

    it("Should parse a function containing default assignment correctly", async function() {
        var ast = parse("var a = (a = 123) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // First argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_DefaultAssign);
        assert(ast.body[0].definitions[0].value.argnames[0].left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].operator, "=");
        assert(ast.body[0].definitions[0].value.argnames[0].right instanceof AST.AST_Number);

        ast = parse("var a = (a = a) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // First argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_DefaultAssign);
        assert(ast.body[0].definitions[0].value.argnames[0].left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].operator, "=");
        assert(ast.body[0].definitions[0].value.argnames[0].right instanceof AST.AST_SymbolRef);
    });

    it("Should parse a function containing default assignments in destructuring correctly", async function() {
        var ast = parse("var a = ([a = 123]) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // First argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, true);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 1);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_DefaultAssign);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].operator, "=");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].right instanceof AST.AST_Number);


        ast = parse("var a = ({a = 123}) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // First argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, false);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 1);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_ObjectKeyVal);

        // First object element in first argument
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].key, "a");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value instanceof AST.AST_DefaultAssign);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value.left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].value.operator, "=");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value.right instanceof AST.AST_Number);


        ast = parse("var a = ({a: a = 123}) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // First argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, false);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 1);

        // Content destructuring of first argument
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_ObjectProperty);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].key, "a");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value instanceof AST.AST_DefaultAssign);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value.left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].value.operator, "=");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value.right instanceof AST.AST_Number);
    });

    it("Should parse a function containing default assignments in complex destructuring correctly", async function() {
        var ast = parse("var a = ([a, [b = 123]]) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // Check first argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, true);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 2);

        // Check whole destructuring structure of first argument
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[1] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[1].is_array, true);

        // Check content of second destructuring element (which is the nested destructuring pattern)
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].names[0] instanceof AST.AST_DefaultAssign);
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].operator, "=");
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].right instanceof AST.AST_Number);


        ast = parse("var a = ([a, {b: c = 123}]) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // Check first argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, true);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 2);

        // Check whole destructuring structure of first argument
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[1] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[1].is_array, false);

        // Check content of second destructuring element (which is the nested destructuring pattern)
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].names[0] instanceof AST.AST_ObjectKeyVal);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].key, "b");
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].value instanceof AST.AST_DefaultAssign);
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].value.left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].value.operator, "=");
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].names[0].value.right instanceof AST.AST_Number);


        ast = parse("var a = ({a, b: {b = 123}}) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // Check first argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, false);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 2);

        // First argument, property 1
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_ObjectKeyVal);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].key, "a");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value instanceof AST.AST_SymbolFunarg);

        // First argument, property 2
        assert(ast.body[0].definitions[0].value.argnames[0].names[1] instanceof AST.AST_ObjectKeyVal);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[1].key, "b");
        assert(ast.body[0].definitions[0].value.argnames[0].names[1].value instanceof AST.AST_Destructuring);

        // Check content of nested destructuring
        var content = ast.body[0].definitions[0].value.argnames[0].names[1].value;
        assert.strictEqual(content.is_array, false);
        assert.strictEqual(content.names.length, 1);
        assert(content.names[0] instanceof AST.AST_ObjectKeyVal);

        // Content of first property in nested destructuring
        assert.strictEqual(content.names[0].key, "b");
        assert(content.names[0].value instanceof AST.AST_DefaultAssign);
        assert(content.names[0].value.left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(content.names[0].value.operator, "=");
        assert(content.names[0].value.right instanceof AST.AST_Number);


        ast = parse("var a = ({a: {b = 123}}) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // Check first argument
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, false);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 1);

        // Check whole destructuring structure of first argument
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_ObjectKeyVal);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].key, "a");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value instanceof AST.AST_Destructuring);

        // Check content of nested destructuring
        content = ast.body[0].definitions[0].value.argnames[0].names[0].value;
        assert.strictEqual(content.is_array, false);
        assert.strictEqual(content.names.length, 1);
        assert(content.names[0] instanceof AST.AST_ObjectKeyVal);

        // Check first property of nested destructuring
        assert.strictEqual(content.names[0].key, "b");
        assert(content.names[0].value instanceof AST.AST_DefaultAssign);
        assert(content.names[0].value.left instanceof AST.AST_SymbolFunarg);
        assert.strictEqual(content.names[0].value.operator, "=");
        assert(content.names[0].value.right instanceof AST.AST_Number);
    });

    it("Should parse spread correctly", async function() {
        var ast = parse("var a = (a, b, ...c) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 3);

        // Check parameters
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[1] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[2] instanceof AST.AST_Expansion);
        assert(ast.body[0].definitions[0].value.argnames[2].expression instanceof AST.AST_SymbolFunarg);


        ast = parse("var a = ([a, b, ...c]) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // Check first parameter
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, true);

        // Check content first parameter
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[1] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[2] instanceof AST.AST_Expansion);
        assert(ast.body[0].definitions[0].value.argnames[0].names[2].expression instanceof AST.AST_SymbolFunarg);


        ast = parse("var a = ([a, b, [c, ...d]]) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // Check first parameter
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, true);

        // Check content outer destructuring array
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[1] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[2] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[2].is_array, true);

        // Check content nested destructuring array
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[2].names.length, 2);
        assert(ast.body[0].definitions[0].value.argnames[0].names[2].names[0] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[2].names[1] instanceof AST.AST_Expansion);
        assert(ast.body[0].definitions[0].value.argnames[0].names[2].names[1].expression instanceof AST.AST_SymbolFunarg);


        ast = parse("var a = ({a: [b, ...c]}) => {}");
        assert(ast.body[0] instanceof AST.AST_Var);
        assert.strictEqual(ast.body[0].definitions.length, 1);
        assert(ast.body[0].definitions[0] instanceof AST.AST_VarDef);
        assert(ast.body[0].definitions[0].name instanceof AST.AST_SymbolVar);
        assert(ast.body[0].definitions[0].value instanceof AST.AST_Arrow);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames.length, 1);

        // Check first parameter
        assert(ast.body[0].definitions[0].value.argnames[0] instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].is_array, false);

        // Check outer destructuring object
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names.length, 1);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0] instanceof AST.AST_ObjectKeyVal);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].key, "a");
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value instanceof AST.AST_Destructuring);
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].value.is_array, true);

        // Check content nested destructuring array
        assert.strictEqual(ast.body[0].definitions[0].value.argnames[0].names[0].value.names.length, 2);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value.names[0] instanceof AST.AST_SymbolFunarg);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value.names[1] instanceof AST.AST_Expansion);
        assert(ast.body[0].definitions[0].value.argnames[0].names[0].value.names[1].expression instanceof AST.AST_SymbolFunarg);
    });

    it("Should handle arrow function with bind", async function() {
        async function min(code) {
            return (await minify(code, {
                mangle: false
            })).code;
        }

        assert.strictEqual(
            await min(await min("test(((index) => { console.log(this, index); }).bind(this, 1));")),
            "test((index=>{console.log(this,index)}).bind(this,1));"
        );
        assert.strictEqual(
            await min(await min('test(((index) => { console.log(this, index); })["bind"](this, 1));')),
            "test((index=>{console.log(this,index)}).bind(this,1));"
        );
    });

    it("Should handle return of arrow function assignment", async function() {
        async function min(code) {
            return (await minify(code, {
                mangle:false
            })).code;
        }

        assert.strictEqual(
          await min("export function foo(x) { bar = () => x; return 2};"),
            "export function foo(x){return bar=()=>x,2}"
        );
    });
});
