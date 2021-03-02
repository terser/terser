import assert from "assert";
import { parse } from "../../lib/parse.js";
import "../../lib/size.js";
import "../../lib/output.js";

describe("size", () => {
    it("approximates the size of expression", () => {
        assert.equal(parse("()=>{return}").size(), 12);
        assert.equal(parse("()=>{return 2}").size(), 5);
        assert.equal(parse("()=>2").size(), 5);
    });
});
