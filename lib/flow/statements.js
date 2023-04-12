import { AST_BlockStatement, AST_Definitions, AST_EmptyStatement, AST_If, AST_SimpleStatement } from "../ast.js";
import { World, sequential } from "./tools.js";
import { conditional } from "./conditionals.js";
import { LiteralType } from "./types.js";

AST_If.prototype._flow = function (world = new World()) {
    const { condition, body, alternative } = this;

    return conditional(this, world, condition, body, alternative);
};

AST_BlockStatement.prototype._flow = function (world = new World()) {
    return sequential(this.body, world.block_scope_world(this));
};

AST_EmptyStatement.prototype._flow = function (_world = new World()) {
    return new LiteralType(undefined);
};

AST_SimpleStatement.prototype._flow = function (world = new World()) {
    return this.body._flow(world);
};

AST_Definitions.prototype._flow = function (world = new World()) {
    for (const def of this.definitions) {
        if (!def.value) {
            continue; // hoist only
        }
        world.write_variable(
            def.name.name,
            def.value._flow(world),
            { is_definition: true }
        );
    }
    return new LiteralType(undefined);
};
