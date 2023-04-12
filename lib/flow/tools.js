import { AST_Const, AST_Definitions, AST_Defun, AST_Lambda, AST_Let, AST_Symbol, AST_Var, walk_parent } from "../ast.js";
import { FunctionType, LiteralType } from "./types.js";
import { map_map_set } from "../utils/index.js";

/** walk a sequence of statements */
export function sequential(nodes, world) {
    let type;
    for (let i = 0; i < nodes.length; i++) {
        type = nodes[i]._flow(world);
    }
    return type || new LiteralType(undefined);
}

/** pre-walk to hoist declarations such as var and defun */
export function analyze_func_or_toplevel_body(node_with_body, world = new World()) {
    const is_function = node_with_body instanceof AST_Lambda;

    const block_scopes = new Map();
    const closest_block_scope = (node, info) => {
        let i = 0, scope;
        while ((scope = info.parent(i++))) {
            if (scope.is_block_scope()) {
                return scope;
            }
        }
    };

    try {
        walk_parent(node_with_body, (node, info) => {
            if (node === node_with_body) return;

            if (node instanceof AST_Defun) {
                if (info.parent() !== node_with_body) {
                    throw NOPE;  // Defun in a block scope
                }

                world.define(node.name.name, new FunctionType(node, world), "defun");
                return true;
            }

            if (node instanceof AST_Definitions) {
                const type =
                    node instanceof AST_Const ? "const"
                    : node instanceof AST_Let ? "let"
                    : node instanceof AST_Var ? "var"
                    : null;

                if (!type) {
                    throw new Error("unexpected definition type " + node.TYPE);
                }

                if (node.definitions.some(d => d.name.name === "arguments")) {
                    throw NOPE;
                }

                const block_scope = (type === "let" || type === "const")
                    && closest_block_scope(node, info);
                // TDZ stuff
                if (block_scope) {
                    for (const definition of node.definitions) {
                        if (definition.name instanceof AST_Symbol) {
                            map_map_set(block_scopes, block_scope, definition.name.name, type);
                        } else {
                            throw new Error("TODO: destructuring");
                        }
                    }

                    return;
                }

                for (const definition of node.definitions) {
                    if (definition.name instanceof AST_Symbol) {
                        world.define(definition.name.name, undefined /* defined when _flow*/, type);
                    } else {
                        throw new Error("TODO: destructuring");
                    }

                    return;
                }
            }

            if (node instanceof AST_Lambda) return true;
        });

        world.set_block_scopes(block_scopes);
        const normal_completion = sequential(node_with_body.body, world);

        if (is_function) {
            return new LiteralType(undefined); // default func return value
        } else {
            return normal_completion;
        }
    } catch (e) {
        if (e instanceof Return) {
            if (is_function) return e.returned;
            throw NOPE;
        }
        throw e;
    }
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

const _binding_func_mask  = 0b10000000;
const binding_block_mask = 0b01000000;
const binding_const_mask = 0b00100000;

const binding_types = {
    // func scope
    "var":      0b10000001,
    "argument": 0b10000010,
    "defun":    0b10000100, // defun can be block-scope too but we nope out.

    // block scope
    "let":      0b01000001,
    "const":    0b01100010,
};

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
    constructor(name, type, binding_type) {
        this.name = name;
        this.type = type;
        this.ambient_type = type;
        if (!(binding_type in binding_types)) {
            throw new Error("unknown binding type " + binding_type);
        }
        this.binding_type = binding_types[binding_type];
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
            // never read or written before
            if (this.binding_type & binding_block_mask) {
                throw NOPE; // TDZ
            }
            const type = new LiteralType(undefined);
            return this.changed({ type, ambient_type: type, reads });
        } else {
            return this.changed({ reads });
        }
    }

    write(type, { is_definition = false }) {
        const writes = this.writes + 1;

        if (this.type == null) {
            const is_tdz_violation = !is_definition && (this.binding_type & binding_block_mask);
            if (is_tdz_violation) throw NOPE;

            // First write: let's pretend this wasn't considered `undefined` before
            return this.changed({ type, ambient_type: type, writes });
        } else {
            const is_const_violation = this.binding_type & binding_const_mask;
            if (is_const_violation) throw NOPE;

            return this.changed({ type, ambient_type: this.type.OR(type), writes });
        }
    }
}

export class World {
    constructor({ module = true, variables, parent_reality = null, parent_scope = null } = {}) {
        this.variables = new Map(variables);
        this.module = module;
        this.parent_reality = parent_reality;
        this.parent_scope = parent_reality;
        this.block_scopes = undefined;
        this.track_rw = true;
        if (
            parent_scope && parent_scope.flow_test
            || parent_reality && parent_reality.flow_test
        ) {
            this.flow_test = true;
        }
    }

    set_block_scopes(s) {
        if (this.block_scopes) {
            throw new Error("set_block_scopes called twice");
        }
        this.block_scopes = s;
    }

    /** create a binding */
    define(name, type, binding_type = "var") {
        if (this.variables.has(name) || name === "arguments" || name === "async") {
            throw NOPE;
        }
        // assigning global
        if (this.parent_scope == null && !this.module) {
            throw NOPE;
        }
        // TODO can we define? (IE TDZ, duplicate const)
        // TODO where to define? Block scope, function scope, global scope
        this.variables.set(name, new Binding(name, type, binding_type));
        return new LiteralType(undefined);
    }
    /** get a binding without recording a "read" */
    get_binding(name) {
        if (!this.variables.has(name)) {
            return this.parent_scope && this.parent_scope.get_binding(name);
        } else {
            return this.variables.get(name);
        }
    }
    /** delete a binding */
    delete_binding(name) {
        if (!this.variables.has(name)) {
            return this.parent_scope && this.parent_scope.delete_binding(name);
        } else {
            this.variables.delete(name);
        }
    }
    /** decrement a binding or delete it */
    decrement_binding(name, side = "reads") {
        if (!this.variables.has(name)) {
            return this.parent_scope && this.parent_scope.delete_binding(name);
        } else {
            let binding = this.variables.get(name);
            binding = binding.changed({ [side]: binding[side] - 1 });
            this.variables.set(name, binding);
        }
    }

    /** enable/disable tracking of reads/writes. Used so that `if (known_false)` doesn't mark `known_false` as used */
    set_track_rw(track) {
        this.track_rw = track;
    }

    write_variable(name, type, {is_definition = true, track = this.track_rw} = {}) {
        let binding = this.variables.get(name);

        if (!binding) {
            if (!this.parent_scope) throw NOPE;

            return this.parent_scope.write_variable(name, type, {
                is_definition,
                track
            });
        } else {
            if (this.track_rw) binding = binding.write(type, {is_definition});
            this.variables.set(binding.name, binding);
            return binding.type;
        }
    }
    read_binding(name, { track = this.track_rw } = {}) {
        if (!this.variables.has(name)) {
            if (!this.parent_scope) throw NOPE;
            return this.parent_scope.read_binding(name, { track });
        } else {
            let binding = this.variables.get(name);
            if (track) binding = binding.read();
            this.variables.set(binding.name, binding);
            return binding;
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
        new_world.block_scopes = this.block_scopes;
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

    block_scope_world(block_scope) {
        const new_world = new World();
        new_world.parent_scope = this;
        new_world.set_block_scopes(this.block_scopes);

        const block_scope_contents = this.block_scopes.get(block_scope);
        if (block_scope_contents) {
            for (const [varname, binding_type] of block_scope_contents) {
                new_world.define(varname, undefined, binding_type);
            }
        }
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

