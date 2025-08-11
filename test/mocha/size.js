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
    it("approximates the size of variable declaration", () => {
        assert.equal(parse("using x=null").size(), 12);
        assert.equal(parse("async()=>{await using x=null}").size(), 30);
    });
});
