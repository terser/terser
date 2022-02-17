// dsa: {
//     options = {
//         toplevel: true,
//         unused: true,
//         reduce_vars: true,
//         side_effects: true,

//         inline: true,
//     }
//     input: {
//         // function cause_side_effect(a = console.log("side effect")) {}
//         // cause_side_effect();

//         function cause_side_effect(
//             // {a} = {a:console.log("side effect 1")},
//             // p2 = console.log("side effect 2"),
//             // p3 = console.log("side effect 3"),

//             p1 = 2,
//             p2 = (()=>{})(),
//         ) {}
//         cause_side_effect(undefined, 2);

//         // function dummy() {}
//         // dummy(cause_side_effect());
//     }
//     expect: {
//         console.log("side effect 1");
//         console.log("side effect 2");
//         console.log("side effect 3");
//     }
// }
// asd: {
//     options = {
//         toplevel: true,
//         unused: true,
//         reduce_vars: true,
//         side_effects: true,

//         inline: true,
//         // passes: 10,

//         // collapse_vars: true,
//         // conditionals: true,
//         // evaluate: true,
//         // inline: true,
//         // passes: 3,
//         // reduce_funcs: true,
//         // reduce_vars: true,
//         // sequences: true,
//         // unused: true,
//     }
//     input: {
//         // function cause_side_effect(a = console.log("side effect")) {}
//         // cause_side_effect();

//         function cause_side_effect(
//             p1 = console.log("side effect 1"),
//             p2 = console.log("side effect 2"),
//             p3 = console.log("side effect 3"),
//         ) {}
//         cause_side_effect(undefined, 2);

//         // function dummy() {}
//         // dummy(cause_side_effect());
//     }
//     expect: {
//         console.log("side effect 1");
//         console.log("side effect 2");
//         console.log("side effect 3");
//     }
// }
simple: {
    options = {
        toplevel: true,
        unused: true,
        reduce_vars: true,
        side_effects: true,
        // passes: 5
    }
    input: {
        function cause_side_effect(p = console.log("side effect")) {}

        cause_side_effect();
        // If the argument evaluates to `undefined`, default assignment is also performed.
        cause_side_effect(undefined);
        // If it is unknown what the argument evaluates to, keep.
        // cause_side_effect(Math.random() > 0.5 ? undefined : true);
        cause_side_effect(id());
        cause_side_effect(id);
    }
    expect: {
        function cause_side_effect(p = console.log("side effect")) {}

        cause_side_effect();
        cause_side_effect(void 0);
        cause_side_effect(id());
        cause_side_effect(id);
    }
    // TODO when I uncomment this it starts saying "failed running reminified input" and producing incorrect output.
    // expect_stdout: [
    //     "side effect",
    //     "side effect",
    //     "side effect",
    // ]
}
drop_if_assignment_not_used: {
    options = {
        toplevel: true,
        unused: true,
        reduce_vars: true,
        side_effects: true,
    }
    input: {
        function cause_side_effect(p = console.log("side effect")) {}

        cause_side_effect("a");
        cause_side_effect(null);
        cause_side_effect({ a: 1 });
        cause_side_effect(() => 1);
    }
    expect: {}
}
// undefined_as_argument: {
//     options = {
//         toplevel: true,
//         unused: true,
//         reduce_vars: true,
//         side_effects: true,
//     }
//     input: {
//         function cause_side_effect(p = console.log("side effect")) {}
//         cause_side_effect(undefined);
//     }
//     expect: {
//         console.log("side effect")
//     }
// }
no_false_positives: {
    options = {
        toplevel: true,
        unused: true,
        reduce_vars: true,
        side_effects: true,
    }
    input: {
        function no_side_effects(
            p1,
            p2 = "a",
            p3 = (() => {})(),
            p4 = undefined,
            p5 = [p1, p2, p3, p4],
            p6,
            ...rest
        ) {
            // return [p1, p2, p3, p4, p5, p6, ...rest];
        }
        no_side_effects();
    }
    expect: {}
}
object_destructuring_getter_side_effect: {
    options = {
        toplevel: true,
        unused: true,
        reduce_vars: true,
        side_effects: true,

        pure_getters: false,
    }
    input: {
        // Evaluating the object in itself is fine, but destructuring it can cause a side effect.
        const obj = { get a() { console.log("side effect") } };
        function cause_side_effect(
            // {a, b} = { a: 1, b: 2 },
            {a} = obj,
        ) {}
        cause_side_effect();
    }
    // expect: {
    //     console.log("side effect")
    // }
    expect_stdout: [
        "side effect",
    ]
}
array_destructuring_getter_side_effect: {
    options = {
        toplevel: true,
        unused: true,
        reduce_vars: true,
        side_effects: true,

        pure_getters: false,
    }
    input: {
        const arr = [0, 0, 0];
        arr.__defineGetter__(0, function () {
            console.log("side effect");
            return 1;
        })
        function cause_side_effect(
            // {a, b} = { a: 1, b: 2 },
            [a, b] = arr,
        ) {}
        cause_side_effect();
    }
    // expect: {
    //     console.log("side effect")
    // }
    expect_stdout: [
        "side effect",
    ]
}
