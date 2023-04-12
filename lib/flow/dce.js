import { TreeTransformer, AST_If, AST_Definitions, AST_VarDef, AST_Number, AST_Conditional, AST_EmptyStatement, AST_SymbolRef } from "../ast.js";
import { MAP, make_node } from "../utils/index.js";
import { KNOWN_ELSE, KNOWN_THEN } from "./conditionals.js";
import { World } from "./tools.js";

// TODO move to utils?
import { make_sequence, make_statements, to_statement } from "../compress/common.js";

export function flow_drop_dead_code(world = new World(), toplevel) {
    let tt = new TreeTransformer((node, descend, in_list) => {
        if (node instanceof AST_Conditional) {
            if (KNOWN_ELSE.has(node)) {
                return node.alternative.transform(tt);
            }
            if (KNOWN_THEN.has(node)) {
                return node.consequent.transform(tt);
            }
            return;
        }
        if (node instanceof AST_If) {
            if (KNOWN_ELSE.has(node)) {
                return keep_statement(tt, node, node.alternative);
            }
            if (KNOWN_THEN.has(node)) {
                return keep_statement(tt, node, node.body);
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
                    out_definitions.push(keep_statement(tt, def, def.value));
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
function keep_expression(tt, orig, node) {
    if (!node) node = [];
    if (!Array.isArray(node)) node = [node];
    node = node.reduce((accum, node) => {
        node = node && node.drop_side_effect_free(tt);
        if (node) accum.push(node);
        return accum;
    }, []);

    node = MAP(node, tt);

    return node.length ? make_sequence(orig, node) : make_node(AST_Number, orig, { value: 0 });
}

/** keep a statement around, but go into it */
function keep_statement(tt, orig, node) {
    if (!node) node = [];
    if (!Array.isArray(node)) node = [node];
    node = node.reduce((accum, node) => {
        node = node && node.transform(tt).drop_side_effect_free(tt);
        if (node) accum.push(node);
        return accum;
    }, []);

    node = MAP(node, tt);

    return make_statements(orig, node);
}
