import { LiteralType } from "./types.js";
import { catch_exit, NOPE, World } from "./tools.js";

export const KNOWN_ELSE = new WeakSet();
export const KNOWN_THEN = new WeakSet();

export function conditional(root_node, world = new World(), condition, body, alternative) {
    // Let's not track reads here
    world.set_track_rw(false);
    const cond_type = condition._flow(world);
    const certain_branch = cond_type.is_truthy();
    world.set_track_rw(true);

    if (certain_branch === true) {
        KNOWN_THEN.add(root_node);
        return body._flow(world);
    } else if (certain_branch === false) {
        KNOWN_ELSE.add(root_node);
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
            : [null, UnknownType];

        // Both exit
        if (body_exit && alt_exit) throw body_exit.OR(alt_exit);

        // Just one exits
        if (body_exit || alt_exit) throw NOPE;

        // Neither exited
        world.join(then_world);
        world.join(else_world);

        return body_type.OR(alt_type);
    }
}

