import { LiteralType } from "./types.js";
import { catch_exit, NOPE, World } from "./tools.js";

export function conditional(root_node, world = new World(), condition, body, alternative) {
    // Let's not track reads here
    world.set_track_rw(false);
    const cond_type = condition._flow(world);
    const certain_branch = cond_type.is_truthy();
    world.set_track_rw(true);

    mark_cond_result(root_node, certain_branch);

    if (certain_branch === true) {
        return body._flow(world);
    } else if (certain_branch === false) {
        return alternative
            ? alternative._flow(world)
            : new LiteralType(undefined);
    } else {
        condition._flow(world); // condition is going to be in the text
        const then_world = world.fork();
        const else_world = world.fork();

        const [body_exit, body_type] = catch_exit(body, then_world);
        const [alt_exit, alt_type] = alternative
            ? catch_exit(alternative, else_world)
            : [null, new LiteralType(undefined)];

        // Both exit
        if (body_exit && alt_exit) throw body_exit.OR(alt_exit);

        // Just one exits
        if (body_exit || alt_exit) throw new NOPE();

        // Neither exited
        world.join(then_world);
        world.join(else_world);

        return body_type.OR(alt_type);
    }
}

const COND_RESULTS = new WeakMap();

/** Returns true if we've only observed the then-branch, false if we've only observed the else-branch and undefined if we don't know, or have observed both. */
export const cond_result_of = (node) => {
    if (!COND_RESULTS.has(node)) {
        throw new Error("expected to know cond result of " + node.print_to_string());
    }
    return COND_RESULTS.get(node);
};

function mark_cond_result(node, certain_branch) {
    if (!COND_RESULTS.has(node)) {
        COND_RESULTS.set(node, certain_branch);
    } else {
        const previous_certain_branch = COND_RESULTS.get(node);
        if (previous_certain_branch !== certain_branch) {
            COND_RESULTS.set(node, undefined);
        }
    }
}
