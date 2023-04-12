import { TreeTransformer, AST_If, AST_Definitions, AST_Number, AST_Conditional, AST_EmptyStatement, AST_BlockStatement } from "../ast.js";
import { MAP, make_node } from "../utils/index.js";
import { KNOWN_ELSE, KNOWN_THEN } from "./conditionals.js";
import { World } from "./tools.js";

// TODO move to utils?
import { make_sequence } from "../compress/common.js";

export function flow_drop_dead_code(world = new World(), toplevel) {
    let tt = new TreeTransformer((node, descend, in_list) => {
        if (node instanceof AST_Conditional) {
            if (KNOWN_ELSE.has(node)) {
                return keep_expression(tt, node, node.alternative, in_list);
            }
            if (KNOWN_THEN.has(node)) {
                return keep_expression(tt, node, node.consequent, in_list);
            }
            return;
        }
        if (node instanceof AST_If) {
            if (KNOWN_ELSE.has(node)) {
                return keep_statement(tt, node, node.alternative, in_list);
            }
            if (KNOWN_THEN.has(node)) {
                return keep_statement(tt, node, node.body, in_list);
            }
            return;
        }
        if (node instanceof AST_Definitions && in_list) {
            const definitions = node.definitions;
            node.definitions = [];
            const out_definitions = [];

            for (const def of definitions) {
                tt.push(def);
                const binding = world.get_binding(def.name.name);

                if (binding && binding.reads === 0) {
                    world.delete_binding(def.name.name);
                    const keep = def.value && def.value.drop_side_effect_free(tt);
                    if (def.value) {
                        out_definitions.push(keep_statement(tt, def, keep));
                    }
                } else {
                    const last = out_definitions[out_definitions.length - 1];
                    if (last instanceof AST_Definitions) {
                        last.definitions.push(def);
                    } else {
                        out_definitions.push(make_node(node.constructor, def, {
                            definitions: [def]
                        }));
                    }
                }

                tt.pop();
            }

            return MAP.splice(out_definitions);
        }
    });

    return toplevel.transform(tt);
}

/** keep a statement around, but go into it */
function keep_expression(tt, orig, node, in_list) {
    const nodes = node ? MAP([node], tt) : [];

    if (!nodes.length && in_list) return MAP.skip;

    return nodes.length ? make_sequence(orig, nodes) : make_node(AST_Number, orig, { value: 0 });
}

/** keep a statement around, but go into it */
function keep_statement(tt, orig, node, in_list) {
    const nodes = node ? MAP([node], tt) : [];

    switch (nodes.length) {
        case 0: return in_list ? MAP.skip : make_node(AST_EmptyStatement, orig);
        case 1: return nodes[0];
        default: return make_node(AST_BlockStatement, orig, { body: nodes });
    }
}
