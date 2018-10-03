/** https://github.com/terser-js/terser#api-reference */
export function minify(code: MinifyCode, options?: MinifyOptions): MinifyResult;

export type MinifyCode = string | { [key: string]: string };

export interface MinifyResult {
    code: string;
    error?: Error;
    warnings?: string[];
    map?: string;
}

/** https://github.com/terser-js/terser#minify-options */
export interface MinifyOptions {
    ecma?: EcmaVersion;
    warnings?: boolean;
    parse?: ParseOptions;
    compress?: CompressOptions;
    mangle?: MangleOptions;
    module?: boolean;
    output?: OutputOptions;
    souceMap?: SourceMapOptions;
    toplevel?: boolean;
    nameCache?: object;
    ie8?: boolean;
    keep_classnames?: boolean;
    keep_fnames?: boolean;
    safari10?: boolean;
}

export type EcmaVersion = 5 | 6 | 7 | 8;

/** https://github.com/terser-js/terser#source-map-options */
export interface SourceMapOptions {
    filename?: string;
    url?: string;
    root?: string;
    content?: string;
}

/** https://github.com/terser-js/terser#parse-options */
export interface ParseOptions {
    bare_returns?: boolean;
    ecma?: EcmaVersion;
    html5_comments?: boolean;
    shebang?: boolean;
}

/** https://github.com/terser-js/terser#compress-options */
export interface CompressOptions {
    arrows?: boolean;
    arguments?: boolean;
    booleans?: boolean;
    collapse_vars?: boolean;
    comparisons?: boolean;
    computed_props?: boolean;
    conditionals?: boolean;
    dead_code?: boolean;
    defaults?: boolean;
    directives?: boolean;
    drop_console?: boolean;
    drop_debugger?: boolean;
    ecma?: EcmaVersion;
    evaluate?: boolean;
    expression?: boolean;
    global_defs?: { [key: string]: any };
    hoist_funs?: boolean;
    hoist_props?: boolean;
    hoist_vars?: boolean;
    if_return?: boolean;
    inline?: boolean | 0 | 1 | 2 | 3;
    join_vars?: boolean;
    keep_classnames?: boolean;
    keep_fargs?: boolean;
    keep_fnames?: boolean;
    keep_infinity?: boolean;
    loops?: boolean;
    module?: boolean;
    negate_iife?: boolean;
    passes?: number;
    properties?: boolean;
    pure_funcs?: string[];
    pure_getters?: boolean | "strict";
    reduce_funcs?: boolean;
    reduce_vars?: boolean;
    sequences?: boolean | number;
    side_effects?: boolean;
    switches?: boolean;
    toplevel?: boolean;
    top_retain?: boolean;
    typeofs?: boolean;
    unsafe?: boolean;
    unsafe_arrows?: boolean;
    unsafe_comps?: boolean;
    unsafe_Function?: boolean;
    unsafe_math?: boolean;
    unsafe_methods?: boolean;
    unsafe_proto?: boolean;
    unsafe_regexp?: boolean;
    unsafe_undefined?: boolean;
    unused?: boolean;
    warnings?: boolean;
}

/** https://github.com/terser-js/terser#mangle-options */
export interface MangleOptions {
    eval?: boolean;
    keep_classnames?: boolean;
    keep_fnames?: boolean;
    module?: boolean;
    reserved?: string[];
    toplevel?: boolean;
    safari10?: boolean;
    properties?: ManglePropertyOptions;
}

/** https://github.com/terser-js/terser#mangle-properties-options */
export interface ManglePropertyOptions {
    builtins?: boolean;
    debug?: false | string;
    keep_quoted?: boolean;
    regex?: RegExp;
    reserved?: string[];
}

/** https://github.com/terser-js/terser#output-options */
export interface OutputOptions {
    ascii_only?: boolean;
    beautify?: boolean;
    braces?: boolean;
    comments?: boolean | "all" | "some" | RegExp | ((node: any, comment: string) => boolean);
    ecma?: EcmaVersion;
    indent_level?: number;
    indent_start?: number;
    inline_script?: boolean;
    keep_quoted_props?: boolean;
    max_line_len?: false | number;
    preamble?: string;
    quote_keys?: boolean;
    quote_style?: 0 | 1 | 2 | 3;
    safari10?: boolean;
    semicolons?: boolean;
    shebang?: boolean;
    webkit?: boolean;
    width?: number;
    wrap_iife?: boolean;
}
