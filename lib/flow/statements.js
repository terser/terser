import {AST_BlockStatement, AST_If, AST_SimpleStatement} from "../ast.js";
import {World, sequential, conditional} from "./tools.js";

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
