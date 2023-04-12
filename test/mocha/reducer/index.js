import assert from "assert/strict";
import { build_graph } from "../../../lib/reducer/index.js";
import { parse } from "../../../lib/parse.js";

const p = source => {
    const parsed = parse(source)
    parsed.figure_out_scope()
    return parsed
}

it("tracks dependencies", () => {
    assert(build_graph(p("1 + 1")).children.length === 0);
    assert(build_graph(p("")).children.length === 0);
});

it.only("functions in expressions", () => {
    const child = build_graph(p(`
        function x() { return y() }
        function y() {}
    `));
    // console.log(child);
});
