// import { }

import { AST_Defun, AST_Lambda, AST_Node, AST_Toplevel, AST_Var, walk, walk_parent } from "../ast.js";

import "./expressions.js";
import "./lambda.js";
import "./statements.js";

import { Exit, hoist_defun_decls, NOPE, sequential, World } from "./tools.js";

/**
 * @module lib/flow.js
 * 
 * Flow analysis for the AST.
 */
AST_Node.prototype.flow_analysis = function (world = new World()) {
    try {
        return this._flow(world);
    } catch (e) {
        if (e === NOPE) return NOPE;
        if (e instanceof Exit) return NOPE;
        throw e; // Pass it through
    }
};

AST_Node.prototype._flow = function (world = new World()) {
    throw NOPE;
};

AST_Toplevel.prototype._flow = function (world = new World()) {
    hoist_defun_decls(this, world);
    return sequential(this.body, world);
};
