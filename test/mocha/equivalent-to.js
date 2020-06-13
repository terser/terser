"use strict";

import assert from "assert";
import "../../main.js"
import { parse } from "../../lib/parse.js";

describe("equivalent_to", () => {
    it("(regression) two regexes should not be equivalent if their source or flags differ", async () => {
        const ast = parse("/^\s*$/u");
        const ast2 = parse("/^\s*\*/u");
        assert.equal(ast.equivalent_to(ast2), false);
    });
    it("nested calls should not be equivalent even if a tree walk reveals equivalent nodes", async () => {
        const ast = parse("hello(1, world(2), 3)");
        const ast2 = parse("hello(1, world(2, 3))");
        assert.equal(ast.equivalent_to(ast2), false);
    });
});

