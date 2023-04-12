import { LiteralType } from "./types.js";
import { catch_exit, NOPE } from "./tools.js";

export const KNOWN_ELSE = new WeakSet();
export const KNOWN_THEN = new WeakSet();

export function conditional(root_node, world = new World(), condition, body, alternative) {
    const cond_type = condition._flow(world);

    const certain_branch = cond_type.is_truthy();

    if (certain_branch === true) {
        KNOWN_THEN.add(root_node);
        return body._flow(world);
    } else if (certain_branch === false) {
        KNOWN_ELSE.add(root_node);
        return alternative
            ? alternative._flow(world)
            : new LiteralType(undefined);
    } else {
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

