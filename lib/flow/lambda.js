import {AST_Call, AST_Defun, AST_Return} from "../ast.js";
import {NOPE, World, sequential, Return, analyze_func_or_toplevel_body} from "./tools.js";
import {LiteralType, FunctionType } from "./types.js";

// Defining the defun is done during hoisting (`hoist_defun_decls`)
AST_Defun.prototype._flow = function (world = new World()) {
    return new LiteralType(undefined);
};

let MAX_CALLS = 1000;
let calls = 0;
AST_Call.prototype._flow = function (world = new World()) {
    if (calls > MAX_CALLS) throw NOPE;

    calls++;
    try {
        let func_type;
        func_type = this.expression._flow(world);

        if (!(func_type instanceof FunctionType)) {
            throw NOPE;
        }

        if (
            world.flow_test &&
            func_type.node &&
            func_type.node.name &&
            func_type.node.name.name === "LOG"
        ) {
            console.log(`LOG(${this.args[0].print_to_string()}) =`, this.args[0]._flow(world));
        }

        let callee_world = func_type.parent_world.callee_world();

        // TODO weird args, `this`, `arguments`, default args, etc.
        let i = 0;
        for (; i < func_type.node.argnames.length; i++) {
            const arg_type = this.args[i]
                ? this.args[i]._flow(world)
                : new LiteralType(undefined);
            callee_world.define(func_type.node.argnames[i].name, arg_type, "argument");
        }

        // Evaluate the rest of the arguments, even if they don't get used
        for (; i < this.args.length; i++) {
            this.args[i]._flow(world);
        }

        return analyze_func_or_toplevel_body(func_type.node, callee_world, { allow_return: true });
    } finally {
        calls--;
    }
};

AST_Return.prototype._flow = function (world = new World()) {
    const ret_type = this.value._flow(world);

    throw new Return(ret_type);
};
