import { AST_Defun, AST_Lambda, AST_Var, walk_parent } from "../ast.js";

/** walk a sequence of statements */
export function sequential(nodes, world) {
    let type;
    for (let i = 0; i < nodes.length; i++) {
        type = nodes[i]._flow(world);
    }
    return type || new LiteralType(undefined);
}

/** pre-walk to hoist declarations such as var and defun */
export function hoist_defun_decls(node_with_body, world) {
    walk_parent(node_with_body, (node, info) => {
        if (node === node_with_body) return;

        if (node instanceof AST_Defun) {
            if (info.parent() !== node_with_body) {
                throw NOPE;  // Defun in a block scope
            }

            world.define(node.name.name, new FunctionType(node, world));
            return true;
        }

        if (node instanceof AST_Var) {
            throw new Error("TODO var hoisting");
        }

        if (node instanceof AST_Lambda) return true;
    });
}


export function catch_exit(node, world) {
    try {
        return [null, node._flow(world)];
    } catch(e) {
        if (e instanceof Exit) {
            return [e, null];
        }
        throw e;
    }
}

export function conditional(world = new World(), condition, body, alternative) {
    const cond_type = condition._flow(world);

    const certain_branch = cond_type.is_truthy();

    if (certain_branch === true) {
        return body._flow(world);
    } else if (certain_branch === false) {
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

export class Type {
    constructor(types) {
        // TODO bitset
        this.types = types;
    }

    OR(other) {
        if (other === UnknownType || this === other) return other;
        if (
            this.types.length === other.types.length 
            && this.types.every((type, i) => type === other.types[i])
        ) {return this;}

        throw new Error("not implemented (Type.OR)");
    }
    is_truthy() {
        return undefined;
    }
}

export class LiteralType extends Type {
    constructor(value) {
        super([typeof value]);
        this.value = value;
    }

    OR(other) {
        if (other === UnknownType || other === this) return other;
        if (other instanceof LiteralType) {
            if (other.value === this.value) return this;
            if (typeof this.value === typeof other.value) return new Type([typeof this.value]);
            return new Type([typeof this.value, typeof other.value]);
        }
        return super.OR(other);
    }
    is_truthy() {
        return !!this.value;
    }
}

export class FunctionType extends Type {
    constructor(node, parent_world) {
        super(["function"]);
        this.node = node;
        this.parent_world = parent_world;
    }

    OR(other) {
        if (other === UnknownType || other === this) return other;
        if (other instanceof FunctionType) {
            if (other.node === this.node) return this;
            return new Type(["function"]);
        }
        return super.OR(other);
    }

    is_truthy() {
        return true;
    }
}

export const UnknownType = new (class extends Type {
    constructor() { super([]); }

    OR(_other) { return this; }
    is_truthy() { return undefined; }
})();

export class World {
    constructor(opts) {
        if (opts) {
            this.variables = new Map(opts.variables);
        } else {
            this.variables = new Map();
        }
        this.parent_reality = null;
        this.parent_scope = null;
    }

    define(name, type) {
        // TODO can we define? (IE TDZ, duplicate const)
        // TODO where to define? Block scope, function scope, global scope
        this.variables.set(name, type);
        return new LiteralType(undefined);
    }
    write_variable(name, type) {
        if (!this.variables.has(name)) {
            if (!this.parent_scope) throw NOPE;
            const written_type = this.parent_scope.write_variable(name, type);
            return written_type;
        } else {
            this.variables.set(name, type);
            return type;
        }
    }
    read_variable(name) {
        if (!this.variables.has(name)) {
            if (!this.parent_scope) throw NOPE;
            return this.parent_scope.read_variable(name);
        } else {
            return this.variables.get(name);
        }
    }

    // Parallel universe stuff
    /** Create a child world that's conditional */
    fork() {
        const new_world = new World(this);
        new_world.parent_reality = this;
        return new_world;
    }
    /** Join the child world with this world. @returns this or UnknownWorld */
    join(forked) {
        if (forked.parent_reality !== this) throw NOPE;

        for (const [joined_var, joined_type] of forked.variables) {
            const type = this.read_variable(joined_var);
            if (type === joined_type) continue;
            this.variables.set(joined_var, type.OR(joined_type));
        }
    }

    callee_world() {
        const new_world = new World();
        new_world.parent_scope = this;
        return new_world;
    }
}

// Throw me to express non-normal completions
export class Exit extends Error {}
export class Return extends Exit {
    constructor(returned) {
        super("return");
        this.returned = returned;
    }

    OR(other) {
        if (other == null) throw NOPE;
        if (other instanceof Return) {
            return new Return(this.returned.OR(other.returned));
        }
        throw NOPE;
    }
}

/** All bets are off! */
export const UnknownWorld = new (class extends World {
    constructor() {
        super();
        this.parent_reality = null;
        this.variables = Object.freeze(new Map());
    }
    define(_name, _type) { throw NOPE; }
    write_variable(_name, _type) { throw NOPE; }
    read_variable(_name) { throw NOPE; }

    fork() { throw NOPE; }
    join(_forked) { throw NOPE; }

    callee_world() { throw NOPE; }
})();

export const NOPE = [UnknownWorld, UnknownType];
