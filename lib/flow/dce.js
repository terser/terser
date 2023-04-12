import { TreeTransformer, AST_If, AST_Conditional } from "../ast.js";
import { MAP } from "../utils/index.js";
import { KNOWN_ELSE, KNOWN_THEN } from "./conditionals.js";

// TODO move to utils?
import { make_sequence, make_statements } from "../compress/common.js";

export function flow_drop_dead_code(world, toplevel) {
    return toplevel.transform(new TreeTransformer((node, descend, in_list) => {
        if (node instanceof AST_Conditional) {
            if (KNOWN_ELSE.has(node)) {
                return make_sequence(node, [node.condition, node.alternative]);
            }
            if (KNOWN_THEN.has(node)) {
                return make_sequence(node, [node.condition, node.consequent]);
            }
            return node;
        }
        if (node instanceof AST_If) {
            if (KNOWN_ELSE.has(node)) {
                return MAP.splice(make_statements(node, [node.condition, node.alternative]).body);
            }
            if (KNOWN_THEN.has(node)) {
                return MAP.splice(make_statements(node, [node.condition, node.body]).body);
            }
            return node;
        }
    }));
}

