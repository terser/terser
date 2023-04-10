// import { }

import { AST_Defun, AST_Lambda, AST_Node, AST_Toplevel, AST_Var, walk, walk_parent } from "../ast.js";

import "./expressions.js";
import "./lambda.js";
import "./statements.js";

import { Exit, hoist_defun_decls, NOPE, sequential, World } from "./tools.js";

/**
 * @module lib/flow/flow.js
 * 
 * Flow analysis for the AST.
 *
 * This module defines AST_Node#_flow() (used in this folder), and AST_Node#flow_analysis (the nice wrapper for outside use)
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

AST_Toplevel.prototype.flow_analysis = function (world = new World()) {
    try {
        const contents = this._flow(world);

        world.fully_walked(this);

        return contents;
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
