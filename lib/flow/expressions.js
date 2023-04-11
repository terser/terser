import {AST_Assign, AST_Binary, AST_Conditional, AST_Number, AST_Sequence, AST_SymbolRef} from "../ast.js";
import {NOPE, World, sequential, conditional} from "./tools.js";
import { LiteralType } from "./types.js";

/**
 * @module
 *
 * Flow analysis for expressions.
 * 
 * Expressions may exit, because they may throw. Or, in the case of
 * the future "do" expression, they may return a value. So, we don't
 * catch exits here.
 *
 * Reminder: by default we will `throw NOPE;` (abort)
 */

// CONSTANTS
AST_Number.prototype._flow = function (world = new World()) {
    return new LiteralType(this.value);
};

// REFERENCES
AST_SymbolRef.prototype._flow = function (world = new World()) {
    if (this.name === "arguments") throw NOPE;

    return world.read_variable(this.name);
};

AST_Assign.prototype._flow = function (world = new World()) {
    const { left, right, operator } = this;

    const right_type = right._flow(world);

    if (left instanceof AST_SymbolRef && operator === "=") {
        return world.write_variable(left.name, right_type, { is_definition: false });
    } else {
        throw NOPE;
    }
};

AST_Sequence.prototype._flow = function (world = new World()) {
    return sequential(this.expressions, world);
};

AST_Conditional.prototype._flow = function (world = new World()) {
    const { condition, consequent, alternative } = this;

    return conditional(world, condition, consequent, alternative);
};

AST_Binary.prototype._flow = function (world = new World()) {
    let left_type, right_type, { left, right, operator } = this;

    left_type = left._flow(world);
    right_type = right._flow(world);

    // TODO
    if (operator === "-" && typeof left_type.value === "number" && right_type.value === 1) {
        return new LiteralType(left_type.value - 1);
    }

    // TODO
    return left_type.OR(right_type);
};