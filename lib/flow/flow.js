// import { }

import { AST_Node, AST_Toplevel } from "../ast.js";

import "./expressions.js";
import "./lambda.js";
import "./statements.js";

import { Exit, analyze_func_or_toplevel_body, NOPE, World } from "./tools.js";

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

AST_Node.prototype._flow = function (_world = new World()) {
    throw NOPE;
};

AST_Toplevel.prototype._flow = function (world = new World()) {
    return analyze_func_or_toplevel_body(this, world);
};
