"use strict";

const assert = require("assert");
const terser = require("../..");

const { AST_Scope, AST_SymbolRef, AST_Call, TreeWalker } = terser;

const sample_code = `
    var x = 'x'

    leak()

    function y(z) {
        scope("defun")

        var x = 'y'

        {
            scope("block")

            let x = 'z'
        }

        leak(x)
    }

    class Foo extends extendee {
        static foo = scope("class")

        method() {
            scope("method")

            var x

            x()
        }
    }
`;

const scopes_simplified = {
    name: "toplevel",
    variables: ["x", "y", "Foo"],
    refs: {
    },
    children: [
        {
            name: "defun",
            variables: ["arguments", "z", "x"],
            refs: {
                x: "defun",
            },
            children: [
                {
                    name: "block",
                    variables: ["x"],
                    refs: {},
                    children: []
                },
            ]
        },
        {
            name: "class",
            variables: [],
            refs: {
                // TODO this is not the right place.
                extendee: "global"
            },
            children: [{
                name: "method",
                variables: ["arguments", "x"],
                children: [],
                refs: {
                    x: "method"
                }
            }]
        }
    ]
};

const draw_scopes = toplevel => {
    let current_scope = {
        scope: toplevel,
        name: "toplevel",
        children: [],
        refs: {}
    };

    const scopes_to_drawn = new Map([
        [toplevel, current_scope]
    ]);

    toplevel.walk(new TreeWalker((node, descend) => {
        if (node === toplevel) return;

        const scope =
            node instanceof AST_Scope ? node :
            node.is_block_scope() ? node.block_scope : null;

        if (scope) {
            const save_current_scope = current_scope;
            current_scope = Object.seal({ scope, name: "", children: [], refs: {} });
            scopes_to_drawn.set(current_scope.scope, current_scope);

            if (save_current_scope) save_current_scope.children.push(current_scope);

            descend();

            current_scope = save_current_scope;

            return true;
        }

        if (node instanceof AST_Call && node.expression.name === "scope") {
            current_scope.name = node.args[0].value;
        }
    }));

    // Find refs
    toplevel.walk(new TreeWalker((node) => {
        if (node instanceof AST_SymbolRef) {
            if (node.name === "scope") return;
            if (node.name === "leak") return;

            const drawn_closest_scope = scopes_to_drawn.get(node.scope);
            const drawn_def_scope = scopes_to_drawn.get(node.thedef.scope);

            if (drawn_def_scope.scope === toplevel && node.thedef.global) {
                drawn_closest_scope.refs[node.name] = "global";
            } else {
                drawn_closest_scope.refs[node.name] = drawn_def_scope.name;
            }
        }
    }));

    return (function simplify(scope) {
        return {
            name: scope.name,
            variables: [...scope.scope.variables.keys()],
            children: scope.children.map(c => simplify(c)),
            refs: scope.refs
        };
    })(current_scope);
};

describe("figure_out_scope", () => {
    it("can figure out the scope by calling figure_out_scope on the toplevel", () => {
        const ast = terser.parse(sample_code);

        ast.figure_out_scope();

        const simplified = draw_scopes(ast);

        assert.deepEqual(simplified, scopes_simplified);
    });

    it("can figure out scope partially after first figure_out_scope has been called", () => {
        const toplevel = terser.parse(sample_code);

        toplevel.figure_out_scope();

        const reference = draw_scopes(toplevel);

        const removal_points = [
            [toplevel.body, 2],
            [toplevel.body, 3]
        ];

        for (const [obj, prop] of removal_points) {
            obj[prop].figure_out_scope({}, { toplevel, parent_scope: toplevel });
            const after = draw_scopes(toplevel);

            assert.deepEqual(after, reference);


            obj[prop] = (function reparse(node) {
                const string = node.print_to_string();

                let parsed;
                try {
                    parsed = terser.parse(string).body[0];
                } catch (e) {
                    parsed = terser.parse(`(${string})`).body[0].body;
                }

                return parsed;
            })(obj[prop]);

            obj[prop].figure_out_scope({}, { toplevel, parent_scope: toplevel });

            const afterReParse = draw_scopes(toplevel);

            assert.deepEqual(afterReParse, reference);
        }
    });
});
