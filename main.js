// API
import "./lib/transform.js";
export { minify } from "./lib/minify.js";

// CLI
export {
    AST_Array,
    AST_Assign,
    AST_Constant,
    AST_Node,
    AST_PropAccess,
    AST_Sequence,
    AST_Symbol,
    AST_Token,
    TreeTransformer,
    TreeWalker,
} from "./lib/ast.js";
export {
    defaults,
    Dictionary,
    push_uniq,
    string_template,
} from "./lib/utils.js";
export { base54 } from "./lib/scope.js";
export { Compressor } from "./lib/compress/index.js";
export { to_ascii } from "./lib/minify.js";
export { OutputStream } from "./lib/output.js";
export { parse }  from "./lib/parse.js";
export {
    mangle_properties,
    reserve_quoted_keys,
} from "./lib/propmangle.js";
export { default_options } from "./tools/node";
import "./lib/mozilla-ast.js";
