
type_aliases: {
    parse = { experimental_typescript: true }
    input: `
        type TypeName<T extends string> = number;
        type Union = "haha" | 2 | null;
        type Tuple = ["string", 1];
        type TupleReadonly = readonly ["tuple"];
        type Heh = [1, string?];
    `
    expect: { }
}

type_tuples: {
    parse = { experimental_typescript: true }
    input: `
        type Named = [1, foo: 2]
        type Optional = [1?]
        type Optional2 = [foo?: 2]
        type Rest = [...T]
    `
    expect: { }
}

type_object: {
    parse = { experimental_typescript: true }
    input: `
        type Obj = {
            property: 123 | "strings" | 1234n,
            tuple: [number, string?],
            new(foo: string, ...bar: Lmao[]): 1,
            new<Type, Parameters>(): 2,
            <T>(arg: T): T,
            (hewwo: Type): 12345,
        };
    `
    expect: { }
}

type_interface: {
    parse = { experimental_typescript: true }
    input: `
        interface UwU<T> {
            [key: string]: Value<T>;
            semicolon: true
            nothing: false
            optional?: T
            optionalMethod?(optionalParam?: boolean)
        }
        interface ExtendsOne extends T1 {}
        interface ExtendsMany extends T1, T2, T3, NS.T4 {}
    `
    expect: { }
}

type_numeric_keys: {
    parse = { experimental_typescript: true }
    input: `
        interface NumericKeys {
            1: number
            [2]: number
            3(): number
            [4](): number
            5()
            [6]()
        }
    `
    expect: { }
}

type_string_keys: {
    parse = { experimental_typescript: true }
    input: `
        interface StringKeys {
            '1': string
            ['2']: string
            '3'(): string
            ['4'](): string
            '5'()
            ['6']()
        }
    `
    expect: { }
}

type_readonly: {
    parse = { experimental_typescript: true }
    input: `
        interface ReadonlyProps {
            readonly number: 1,
            tuple: readonly [],
            readonly readonlyTuple: readonly [Tuple],
            // misdirection
            readonly<x>(),
            readonly: 1,
            readonly(): 1,
            readonly?(): 1,
        }
    `
    expect: { }
}

type_body_separators: {
    parse = { experimental_typescript: true }
    input: `
        interface Commas {
            a: 1,
            b: 2,
        }
        interface Semicolons {
            a: 1;
            b: 2;
        }
        interface NoComma {
            a: 1
            b: 2
        }
        interface NoTrailingComma {
            a: 1
        }
    `
    expect: { }
}

typed_declarations: {
    parse = { experimental_typescript: true }
    input: `
        var x: number = 3 as string;
        const x2 = {} satisfies BigInt;
        var y: typeof func = 3;
        var z: typeof func.property['computed'] = 4;
        try { } catch (e: ErrorType) {};
    `
    expect: {
        var x = 3;
        const x2 = {};
        var y = 3;
        var z = 4;
        try { } catch (e) {};
    }
}

type_parameters_calls: {
    parse = { experimental_typescript: true }
    input: `
        callExpression<T>(arg);
        optionalCallExpression?.<T>(arg);
        optionalCallExpression2<T>?.(arg);
        method.call<T>(arg);
    `
    expect: {
        callExpression(arg);
        optionalCallExpression?.(arg);
        optionalCallExpression2?.(arg);
        method.call(arg);
    }
}

type_parameters: {
    parse = { experimental_typescript: true }
    input: `
        function functionDeclaration<T extends Foo.Bar = 1>(this: Type): ReturnType { }
        ;(function functionExpression<T extends Foo.Bar = 1>(this: Type): ReturnType { })
        const arrowBlock = <T>(): ReturnType => { }
        const arrowExpr = <T>(): ReturnType => expr()
        const asyncArrow = async (typed: Type) => null
        const asyncArrowT = async <T>(typed: Type) => null
        call<T>(1);
        call<T1, T2>();
    `
    expect: {
        function functionDeclaration() { }
        ;(function functionExpression() { })
        const arrowBlock = () => { }
        const arrowExpr = () => expr()
        const asyncArrow = async (typed) => null
        const asyncArrowT = async (typed) => null
        call(1);
        call();
    }
}

typed_function_args: {
    parse = { experimental_typescript: true }
    input: `
        function args(this: Type, typed: Type, untyped, optional?: number, { destructured }: Typed, ...rest: any[]): Ret {}
        const arrowFunctionArgs = (typed: Type, untyped, optional?: number, { destructured }: Typed, ...rest: any[]): Ret => {}
    `
    expect: {
        function args(typed, untyped, optional, { destructured }, ...rest) {}
        const arrowFunctionArgs = (typed, untyped, optional, { destructured }, ...rest) => {}
    }
}

typed_class_head: {
    parse = { experimental_typescript: true }
    input: `
        class ClassTypeParameters<T> {}
        class ClassImplements implements Type {}
        class ClassExtendsImplements extends OtherClass implements Type {}
        class ClassImplementsMany extends OtherClass implements T1, T2 {}
    `
    expect: {
        class ClassTypeParameters {}
        class ClassImplements {}
        class ClassExtendsImplements extends OtherClass {}
        class ClassImplementsMany extends OtherClass {}
    }
}


typed_class_elements: {
    parse = { experimental_typescript: true }
    input: `
        class ClassElements {
            constructor() // no impl. should not appear in output
            private constructor(typed: Type) {}

            protected static declared<TypeParams>(arg: Typed) // no impl
            protected static declared<TypeParams>(arg: Typed) {}

            private static readonly 3: number = 3
            private static get foo<T>(): Type {}
            private static set foo<T>(value: Type): Type {}

            [ident: string]: number
        }
    `
    expect: {
        class ClassElements {
            constructor(typed) {}

            static declared(arg) {}

            static 3 = 3
            static get foo() {}
            static set foo(value) {}
        }
    }
}

typed_objects: {
    parse = { experimental_typescript: true }
    input: `
        const object = {
            get property(): number { },
            set property(arg: Type) { },
        }
    `
    expect: {
        const object = {
            get property() { },
            set property(arg) { },
        }
    }
}

typescript_ambiguous_with_comparison_syntax: {
    parse = { experimental_typescript: true }
    input: `
        ambiguous<">">(1)
        ambiguous<"]">(1)
        ambiguous<T
            // >
        >(1)
        ambiguous<T/* > */>(1)
        ambiguous<\`>\`>(1)
        ambiguous<\`]\`>(1)
        ambiguous<\`foo $\{T} bar\`>(1)
        ambiguous<\`$\{[">"]}\`>(1)
    `
    expect: {
        ambiguous(1);
        ambiguous(1);
        ambiguous(1);
        ambiguous(1);
        ambiguous(1);
        ambiguous(1);
        ambiguous(1);
        ambiguous(1);
    }
}

typescript_dynamic_imports: {
    parse = { experimental_typescript: true }
    input: `
        type T = import('module')
        type TDot = import('module').Property
    `
    expect: {}
}

typescript_imports: {
    parse = { experimental_typescript: true }
    input: `
        // fully typescript imports
        import type Default from "module"
        import type * as Star from "module"
        import type { Named } from "module"
        import type { Named as Renamed } from "module"
        import type { default as NamedDefault } from "module"
        import type A, { F } from 'module'

        // partially typescript imports
        import { Partial, type Removed } from "module"
        import { Partial, type Removed as RenamedRemoved } from "module"

        // misdirection
        import type from 'module'
        import { type } from 'module'
        import { type as Renamed } from 'module'
        import type, { A } from 'module'
    `
    expect: {
        // fully typescript imports
        // (ellided)

        // partially typescript imports
        import { Partial } from "module"
        import { Partial } from "module"

        // misdirection
        import type from 'module'
        import { type } from 'module'
        import { type as Renamed } from 'module'
        import type, { A } from 'module'
    }
}

typescript_imports_incompatible_with_estree_test: {
    parse = { experimental_typescript: true }
    input: `
        import { type 'string' as NamedStringType } from "module"
        import { type default as NamedDefaultType } from "module"
        import A, { type F } from 'module'
    `
    expect: {
        import {  } from "module"
        import {  } from "module"
        import A, { } from "module"
    }
    no_mozilla_ast = true // ESTree can't represent the "{ }"
}

typescript_exports: {
    parse = { experimental_typescript: true }
    input: `
        // fully typescript exports
        export type X = 1
        export interface Interface {}
        export type { X }
        export type { X as Y }
        export type { X as default }
        export type { X as 'stringly' }

        // partially typescript exports
        export { Value, type X }
        export { OtherValue, type X as Y }
        export { OtherValue, type X as default }
        export { OtherValue, type X as 'stringly' }
    `
    expect: {
        // fully typescript exports
        // (ellided)

        // partially typescript exports
        export { Value }
        export { OtherValue }
        export { OtherValue }
        export { OtherValue }
    }
}

typescript_export_from: {
    parse = { experimental_typescript: true }
    input: `
        // fully typescript export-from
        export type * from 'module'
        export type * as NamedStar from 'module'
        export type { X } from 'module'
        export type { X as Y } from 'module'
        export type { default } from 'module'
        export type { 'stringly' as default } from 'module'
        export type { 'stringly' } from 'module'
        export type { 'stringly' as 'otherstringly' } from 'module'

        // partially typescript export-from
        export { a, type X } from 'module'
        export { a, type X as Y } from 'module'
        export { a, type default } from 'module'
        export { a, type 'stringly' as default } from 'module'
        export { a, type 'stringly' } from 'module'
        export { a, type 'stringly' as 'otherstringly' } from 'module'
    `
    expect: {
        // fully typescript export-from
        // (ellided)

        // partially typescript export-from
        export { a } from 'module'
        export { a } from 'module'
        export { a } from 'module'
        export { a } from 'module'
        export { a } from 'module'
        export { a } from 'module'
    }
}

// Counter examples
typescript_disabled_forward_declaration: {
    bad_input: `function forward();`
    expect_error: ({ pos: 18 })
}
typescript_disabled_async_forward_declaration: {
    bad_input: `async function forward();`
    expect_error: ({ pos: 24 })
}
typescript_disabled_method_forward_declaration: {
    bad_input: `(class{forward();});`
    expect_error: ({ pos: 16 })
}
typescript_disabled_type_parameters: {
    bad_input: `function params<T>() {}`
    expect_error: ({ pos: 15 })
}
typescript_disabled_call_type_parameters: {
    bad_input: `params<T>();`
    expect_error: ({ pos: 11 })
}
typescript_disabled_call_type_parameters_are_valid_js: {
    input: `params<T>(1, 2);`
    expect: { params < T > (1, 2); }
}
typescript_disabled_type_parameters_arrow: {
    bad_input: `var x = <T>(arg) => null`
    expect_error: ({ pos: 8 })
}
typescript_disabled_type_parameters_async_arrow: {
    bad_input: `var x = lmao <T>(arg) => null`
    expect_error: ({ pos: 22 })
}
typescript_disabled_arg_type: {
    bad_input: `(function(arg: T) {})`
    expect_error: ({ pos: 13 })
}
typescript_disabled_ret_type: {
    bad_input: `(function(arg): T {})`
    expect_error: ({ pos: 14 })
}
typescript_disabled_this_arg_type: {
    bad_input: `(function(this: T) {})`
    expect_error: ({ pos: 10 })
}
typescript_disabled_this_arg: {
    bad_input: `(function(this) {})`
    expect_error: ({ pos: 10 })
}
typescript_disabled_arrow_arg_type: {
    bad_input: `var x = (arg: T) => null`
    expect_error: ({ pos: 12 })
}
typescript_disabled_arrow_ret_type: {
    bad_input: `var x = (arg): Ret => null`
    expect_error: ({ pos: 13 })
}
typescript_disabled_typed_vardecl: {
    bad_input: `var x: num`
    expect_error: ({ pos: 5 })
}
typescript_disabled_declared_method: {
    bad_input: `(class{meth();meth(){}})`
    expect_error: ({ pos: 13 })
}
typescript_disabled_class_implements: {
    bad_input: `class X implements T{}`
    expect_error: ({ pos: 8 })
}
typescript_disabled_class_tricky_fields: {
    input: `
        class X {
            private() {}
            public() {}
            protected() {}
            readonly() {}
            private
            public
            protected
            readonly
        }
        console.log(new X);
    `
    expect_stdout: true
}
typescript_disabled_import_type: {
    bad_input: `import type X from "module";`
    expect_error: ({ pos: 12 })
}
typescript_disabled_import_type_2: {
    bad_input: `import { type X } from "module";`
    expect_error: ({ pos: 14 })
}
typescript_disabled_as: {
    bad_input: `x as T;`
    expect_error: ({ pos: 2 })
}
typescript_disabled_satisfies: {
    bad_input: `x satisfies T;`
    expect_error: ({ pos: 2 })
}

typescript_disabled_type: {
    input: `
        type
        name = 1;
    `
    expect: {
        type;
        name = 1;
    }
}
typescript_disabled_interface: {
    input: `
        interface
        name
        {};
    `
    expect: {
        interface;
        name;
    }
}
