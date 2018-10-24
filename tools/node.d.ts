import { RawSourceMap } from 'source-map';

export type ECMA = 5 | 6 | 7 | 8;

export interface ParseOptions {
    bare_returns?: boolean;
    ecma?: ECMA;
    html5_comments?: boolean;
    shebang?: boolean;
}

export interface CompressOptions {
    arguments?: boolean;
    arrows?: boolean;
    booleans?: boolean;
    collapse_vars?: boolean;
    comparisons?: boolean;
    conditionals?: boolean;
    dead_code?: boolean;
    defaults?: boolean;
    directives?: boolean;
    drop_console?: boolean;
    drop_debugger?: boolean;
    evaluate?: boolean;
    expression?: boolean;
    global_defs?: object;
    hoist_funs?: boolean;
    hoist_props?: boolean;
    hoist_vars?: boolean;
    if_return?: boolean;
    inline?: boolean | InlineFunctions;
    join_vars?: boolean;
    keep_classnames?: boolean;
    keep_fargs?: boolean;
    keep_fnames?: boolean;
    keep_infinity?: boolean;
    loops?: boolean;
    negate_iife?: boolean;
    passes?: number;
    properties?: boolean;
    pure_funcs?: string[];
    pure_getters?: boolean | 'strict';
    reduce_funcs?: boolean;
    reduce_vars?: boolean;
    sequences?: boolean;
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

export enum InlineFunctions {
    Disabled = 0,
    SimpleFunctions = 1,
    WithArguments = 2,
    WithArgumentsAndVariables = 3
}
export interface MangleOptions {
    eval?: boolean;
    keep_classnames?: boolean;
    keep_fnames?: boolean;
    module?: boolean;
    properties?: boolean | ManglePropertiesOptions;
    reserved?: string[];
    safari10?: boolean;
    toplevel?: boolean;
}

export interface ManglePropertiesOptions {
    builtins?: boolean;
    debug?: boolean;
    keep_quoted?: boolean;
    regex?: RegExp;
    reserved?: string[];
}

export interface OutputOptions {
    ascii_only?: boolean;
    beautify?: boolean;
    braces?: boolean;
    comments?: boolean | 'all' | 'some' | RegExp;
    ecma?: ECMA;
    indent_level?: number;
    indent_start?: boolean;
    inline_script?: boolean;
    is8?: boolean;
    keep_quoted_props?: boolean;
    max_line_len?: boolean;
    preamble?: string;
    quote_keys?: boolean;
    quote_style?: OutputQuoteStyle;
    safari10?: boolean;
    semicolons?: boolean;
    shebang?: boolean;
    shorthand?: boolean;
    source_map?: SourceMapOptions;
    webkit?: boolean;
    width?: number;
    wrap_iife?: boolean;
}

export enum OutputQuoteStyle {
    PreferDouble = 0,
    AlwaysSingle = 1,
    AlwaysDouble = 2,
    AlwaysOriginal = 3
}

export interface MinifyOptions {
    compress?: boolean | CompressOptions;
    ecma?: ECMA;
    ie8?: boolean;
    keep_classnames?: boolean;
    keep_fnames?: boolean;
    mangle?: boolean | MangleOptions;
    module?: boolean;
    nameCache?: object;
    output?: OutputOptions;
    parse?: ParseOptions;
    safari10?: boolean;
    sourceMap?: boolean | SourceMapOptions;
    toplevel?: boolean;
    warnings?: boolean | 'verbose';
}

export interface MinifyOutput {
    code: string;
    error?: Error;
    map: string;
    warnings?: string[];
}

export interface SourceMapOptions {
    content?: RawSourceMap;
    includeSources?: boolean;
    filename?: string;
    root?: string;
    url?: string | 'inline';
}

declare function parse(text: string, options?: any): string;

declare class NodeElement {
    constructor(props: any);
    BASE?: NodeElement;
    PROPS: string[];
    SELF_PROPS: string[];
    SUBCLASSES: NodeElement[];
    TYPE: string;
    documentation: string;
    propdoc?: Record<string, string>;
    expressions?: NodeElement[];
    warn?: (text: string, props: any) => void;
    from_mozilla_ast?: (node: NodeElement) => any;
}

export class TreeWalker {
    constructor(callback: (node: NodeElement, descend: boolean) => NodeElement);
    directives: object;
    find_parent(type: NodeElement): NodeElement | undefined;
    has_directive(type: string): boolean;
    loopcontrol_target(node: NodeElement): NodeElement | undefined;
    parent(n: number): NodeElement | undefined;
    pop(): void;
    push(node: NodeElement): void;
    self(): NodeElement | undefined;
    stack: NodeElement[];
    visit: (node: NodeElement, descend: boolean) => NodeElement;
}

export class TreeTransformer extends TreeWalker {
    constructor(before: (node: NodeElement) => NodeElement, after?: (node: NodeElement) => NodeElement);
    before: (node: NodeElement) => NodeElement;
    after?: (node: NodeElement) => NodeElement;
}

export function push_uniq<T>(array: T[], el: T): void;

type DictEachCallback = (val: any, key: string) => any;

export class Dictionary {
    static fromObject(obj: object): Dictionary;
    add(key: string, val: any): this;
    clone(): Dictionary;
    del(key: string): this;
    each(fn: DictEachCallback): void;
    get(key: string): any;
    has(key: string): boolean;
    map(fn: DictEachCallback): any[];
    set(key: string, val: any): this;
    size(): number;
}

export function minify(files: string | string[] | { [file: string]: string }, options?: MinifyOptions): MinifyOutput;
