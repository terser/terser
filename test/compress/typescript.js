
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
        type T = import('./module.ts')
        type TDot = import('./module.ts').Property
    `
    expect: {}
}
