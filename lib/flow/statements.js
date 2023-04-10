import {AST_BlockStatement, AST_Definitions, AST_If, AST_SimpleStatement, AST_Var} from "../ast.js";
import {World, sequential, conditional, LiteralType} from "./tools.js";

AST_If.prototype._flow = function (world = new World()) {
    const { condition, body, alternative } = this;

    return conditional(world, condition, body, alternative);
};

AST_BlockStatement.prototype._flow = function (world = new World()) {
    return sequential(this.body, world);
};

AST_SimpleStatement.prototype._flow = function (world = new World()) {
    return this.body._flow(world);
};

AST_Var.prototype._flow = function (world = new World()) {
    for (const def of this.definitions) {
        if (!def.value) {
            continue; // hoist only
        }
        world.write_variable(def.name.name, def.value._flow(world));
    }
    return new LiteralType(undefined);
};
