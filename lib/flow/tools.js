import { AST_Definitions, AST_Defun, AST_Lambda, AST_Symbol, AST_Var, AST_VarDef, walk_parent } from "../ast.js";

const is = Object.is || ((a, b) => {
    if (isNaN(a)) return isNaN(b);
    return a === b;
});

/** walk a sequence of statements */
export function sequential(nodes, world) {
    let type;
    for (let i = 0; i < nodes.length; i++) {
        type = nodes[i]._flow(world);
    }
    return type || new LiteralType(undefined);
}

/** pre-walk to hoist declarations such as var and defun */
export function hoist_defun_decls(node_with_body, world = new World()) {
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
            for (const definition of node.definitions) {
                if (definition.name instanceof AST_Symbol) {
                    if (definition.name.name === "arguments") throw NOPE;
                    world.define(definition.name.name, undefined /* defined when _flow*/);
                } else {
                    throw new Error("TODO: destructuring");
                }
            }
            return true;
        }

        if (node instanceof AST_Definitions) {
            throw new Error("TODO: hoisting TDZs");
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
        if (new.target === Type) {
            return new GenericType(types);
        } else {
            this.types = types;
        }
    }

    OR(other) {
        if (other === UnknownType || this.equals(other)) return other;
        if (
            this.types.length === other.types.length
            && this.types.every((type, i) => type === other.types[i])
        ) {return this;}

        const all_types = new Set([...this.types, ...other.types]);
        return new GenericType([...all_types]);
    }

    equals(other) {
        throw new Error("not implemented (Type.equals)");
    }

    is_truthy() {
        return undefined;
    }
}

export class GenericType extends Type {
    constructor(types) {
        super(types);
    }

    equals(other) {
        return other === this
            || other instanceof GenericType
                && this.types.length === other.types.length 
                && this.types.every((type, i) => type === other.types[i]);
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
            if (is(other.value, this.value)) return this;
            if (typeof this.value === typeof other.value) return new Type([typeof this.value]);
            return new Type([typeof this.value, typeof other.value]);
        }
        return super.OR(other);
    }

    equals(other) {
        return other === this
            || other instanceof LiteralType
                && is(other.value, this.value);
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

    equals(other) {
        return other === this
            || other instanceof FunctionType
                && other.node === this.node
                && other.parent_world === this.parent_world;
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

/**
 * A single variable binding. It has a "type" and an "ambient type" which is the OR
 * between all the types it had before.
 *
 * Before its first read, `.type` may be `undefined` instead of a type. This means the
 * name is in the scope, but doesn't exist yet (eg. a hoisted `var`). This distinction
 * enables us to only treat hoisted `var` as `undefined | SomeType` when it's possible
 * to read that as undefined.
 *
 * Immutable
 **/
export class Binding {
    constructor(name, type, binding_type = "var") {
        this.name = name;
        this.type = type;
        this.ambient_type = type;
        this.binding_type = binding_type;
        this.reads = 0;
        this.writes = 0;
    }

    changed(overrides = {}) {
        const changed = Object.create(Binding.prototype);

        changed.name = overrides.name || this.name;
        changed.type = overrides.type || this.type;
        changed.ambient_type = overrides.ambient_type || this.ambient_type;
        changed.binding_type = overrides.binding_type || this.binding_type;
        changed.reads = overrides.reads != null ? overrides.reads : this.reads;
        changed.writes = overrides.writes != null ? overrides.writes : this.writes;

        return changed;
    }

    /** Join (as opposed to fork) a binding with the opposite side of a conditional branch */
    OR(other_reality_binding) {
        if (other_reality_binding === this) return this;

        if (this.type == null && other_reality_binding.type == null) {
            // Never read on either side
            return this;
        }

        if (this.type == null || other_reality_binding.type == null) {
            // Only read on one side. Don't deal with this!
            throw NOPE;
        }

        const joined_type = other_reality_binding.type.OR(this.type);

        if (joined_type !== this.type) {
            // all our types so far & all their types so far
            const type = this.ambient_type.OR(other_reality_binding.ambient_type);
            return this.changed({
                type,
                ambient_type: type
            });
        } else {
            return this;
        }
    }

    read() {
        const reads = this.reads + 1;
        if (this.type == null) {
            // Naked read: the var wasn't written-to yet!
            // We've been observed to be `undefined`
            return this.changed({
                type: new LiteralType(undefined),
                ambient_type: new LiteralType(undefined),
                reads
            });
        } else {
            return this.changed({ reads });
        }
    }

    write(type) {
        const writes = this.writes + 1;

        if (this.type == null) {
            // First write: let's pretend this wasn't considered `undefined` before
            return this.changed({ type, ambient_type: type, writes });
        } else {
            return this.changed({ type, ambient_type: this.type.OR(type), writes });
        }
    }
}

export class World {
    constructor({ module, variables, parent_reality = null, parent_scope = null } = {}) {
        this.variables = new Map(variables);
        this.module = module || false;
        this.parent_reality = parent_reality;
        this.parent_scope = parent_reality;
    }

    define(name, type) {
        if (this.variables.has(name) || name === "arguments" || name === "async") {
            throw NOPE;
        }
        // assigning global
        if (this.parent_scope == null && !this.module) {
            throw NOPE;
        }
        // TODO can we define? (IE TDZ, duplicate const)
        // TODO where to define? Block scope, function scope, global scope
        this.variables.set(name, new Binding(name, type));
        return new LiteralType(undefined);
    }
    write_variable(name, type) {
        let binding = this.variables.get(name);

        if (!binding) {
            if (!this.parent_scope) throw NOPE;

            const written_type = this.parent_scope.write_variable(name, type);
            return written_type;
        } else {
            binding = binding.write(type);
            this.variables.set(binding.name, binding);
            return binding.type;
        }
    }
    read_binding(name) {
        if (!this.variables.has(name)) {
            if (!this.parent_scope) throw NOPE;
            return this.parent_scope.read_binding(name);
        } else {
            let binding = this.variables.get(name);
            if (binding) {
                binding = binding.read();
                this.variables.set(binding.name, binding);
                return binding;
            } else {
                throw NOPE;
            }
        }
    }
    read_variable(name) {
        return this.read_binding(name).type;
    }
    read_variable_ambient(name) {
        return this.read_binding(name).ambient_type;
    }

    // Parallel universe stuff
    /** Create a child world that's conditional */
    fork() {
        const new_world = new World(this);
        new_world.parent_reality = this;
        return new_world;
    }
    /** Join the child world with this world. */
    join(forked) {
        if (forked.parent_reality !== this) throw NOPE;

        for (const [varname, forked_binding] of forked.variables) {
            const binding = this.variables.get(varname).OR(forked_binding);
            this.variables.set(varname, binding);
        }
    }

    callee_world() {
        const new_world = new World();
        new_world.parent_scope = this;
        return new_world;
    }

    fully_walked() {
        // Our knowledge about bindings is considered to be complete
        this.walked = true;
    }

    variable_facts(var_name) {
        if (this.walked) {
            return this.variables.get(var_name);
        }
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

export const NOPE = Symbol("NOPE (flow analysis impossible)");
