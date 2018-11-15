import { RawSourceMap } from 'source-map';

export type ECMA = 5 | 6 | 7 | 8 | 9;

export interface ParseOptions {
    bare_returns?: boolean;
    ecma?: ECMA;
    html5_comments?: boolean;
    shebang?: boolean;
}

export interface Def {
    assignments: number;
    chained: boolean;
    direct_access: boolean;
    escaped: boolean;
    fixed: boolean;
    scope: {
        pinned: () => boolean;
    };
    init: any;
    orig: AST_Node[];
    recursive_refs: number;
    references: any[];
    should_replace: boolean;
    single_use: boolean;
    name: string;
    id: any;
    safe_ids: any[];
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
    keep_classnames?: boolean | RegExp;
    keep_fargs?: boolean;
    keep_fnames?: boolean | RegExp;
    keep_infinity?: boolean;
    loops?: boolean;
    negate_iife?: boolean;
    passes?: number;
    properties?: boolean;
    pure_funcs?: string[];
    pure_getters?: boolean | 'strict';
    reduce_funcs?: boolean;
    reduce_vars?: boolean;
    sequences?: boolean | number;
    side_effects?: boolean;
    switches?: boolean;
    toplevel?: boolean;
    top_retain?: null | string | string[] | RegExp | ((def: Def) => boolean);
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
    keep_classnames?: boolean | RegExp;
    keep_fnames?: boolean | RegExp;
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
    ie8?: boolean;
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
    keep_classnames?: boolean | RegExp;
    keep_fnames?: boolean | RegExp;
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
    ast?: AST_Node;
    code?: string;
    error?: Error;
    map?: string;
    warnings?: string[];
}

export interface SourceMapOptions {
    content?: RawSourceMap;
    includeSources?: boolean;
    filename?: string;
    root?: string;
    url?: string | 'inline';
}

declare function parse(text: string, options?: ParseOptions): AST_Node;

export class TreeWalker {
    constructor(callback: (node: AST_Node, descend: boolean) => any);
    directives: object;
    find_parent(type: AST_Node): AST_Node | undefined;
    has_directive(type: string): boolean;
    loopcontrol_target(node: AST_Node): AST_Node | undefined;
    parent(n: number): AST_Node | undefined;
    pop(): void;
    push(node: AST_Node): void;
    self(): AST_Node | undefined;
    stack: AST_Node[];
    visit: (node: AST_Node, descend: boolean) => any;
}

export class TreeTransformer extends TreeWalker {
    constructor(before: (node: AST_Node) => AST_Node, after?: (node: AST_Node) => AST_Node);
    before: (node: AST_Node) => AST_Node;
    after?: (node: AST_Node) => AST_Node;
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

export function minify(files: string | string[] | { [file: string]: string } | AST_Node, options?: MinifyOptions): MinifyOutput;

export class AST_Node {
    constructor(props?: object);
    static BASE?: AST_Node;
    static PROPS: string[];
    static SELF_PROPS: string[];
    static SUBCLASSES: AST_Node[];
    static documentation: string;
    static propdoc?: Record<string, string>;
    static expressions?: AST_Node[];
    static warn?: (text: string, props: any) => void;
    static from_mozilla_ast?: (node: AST_Node) => any;
    TYPE: string;
    CTOR: typeof AST_Node;
}

export class AST_Statement extends AST_Node {
    _codegen: Function;
    _eval: Function;
    negate: Function;
    aborts: Function;
}

export class AST_Debugger extends AST_Statement {
    _codegen: Function;
    add_source_map: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Directive extends AST_Statement {
    _codegen: Function;
    add_source_map: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_SimpleStatement extends AST_Statement {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    has_side_effects: Function;
    may_throw: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Block extends AST_Statement {
    _walk: Function;
    clone: Function;
    transform: Function;
    is_block_scope: Function;
    reduce_vars: Function;
    has_side_effects: Function;
    may_throw: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_BlockStatement extends AST_Block {
    _codegen: Function;
    add_source_map: Function;
    aborts: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Scope extends AST_Block {
    get_defun_scope: Function;
    clone: Function;
    pinned: Function;
    init_scope_vars: Function;
    find_variable: Function;
    def_function: Function;
    def_variable: Function;
    next_mangled: Function;
    process_expression: Function;
    drop_unused: Function;
    hoist_declarations: Function;
    var_names: Function;
    make_var_name: Function;
    hoist_properties: Function;
}

export class AST_Toplevel extends AST_Scope {
    wrap_commonjs: Function;
    wrap_enclose: Function;
    figure_out_scope: Function;
    def_global: Function;
    is_block_scope: Function;
    next_mangled: Function;
    _default_mangler_options: Function;
    mangle_names: Function;
    find_colliding_names: Function;
    expand_names: Function;
    compute_char_frequency: Function;
    _codegen: Function;
    add_source_map: Function;
    drop_console: Function;
    reduce_vars: Function;
    reset_opt_flags: Function;
    resolve_defines: Function;
    to_mozilla_ast: Function;
}

export class AST_Lambda extends AST_Scope {
    args_as_names: Function;
    _walk: Function;
    transform: Function;
    is_block_scope: Function;
    init_scope_vars: Function;
    _do_print: Function;
    _codegen: Function;
    add_source_map: Function;
    _eval: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    optimize: Function;
    contains_this: Function;
    to_mozilla_ast: Function;
}

export class AST_Accessor extends AST_Lambda {
    reduce_vars: Function;
    drop_side_effect_free: Function;
}

export class AST_Function extends AST_Lambda {
    next_mangled: Function;
    needs_parens: Function;
    reduce_vars: Function;
    _dot_throw: Function;
    _eval: Function;
    negate: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Arrow extends AST_Lambda {
    init_scope_vars: Function;
    needs_parens: Function;
    _do_print: Function;
    reduce_vars: Function;
    _dot_throw: Function;
    negate: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Defun extends AST_Lambda {
    reduce_vars: Function;
    to_mozilla_ast: Function;
}

export class AST_Class extends AST_Scope {
    _walk: Function;
    transform: Function;
    is_block_scope: Function;
    _codegen: Function;
    add_source_map: Function;
    _eval: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_DefClass extends AST_Class {
    reduce_vars: Function;
    has_side_effects: Function;
}

export class AST_ClassExpression extends AST_Class {
    needs_parens: Function;
    reduce_vars: Function;
    drop_side_effect_free: Function;
}

export class AST_Switch extends AST_Block {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    add_source_map: Function;
    has_side_effects: Function;
    may_throw: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_SwitchBranch extends AST_Block {
    is_block_scope: Function;
    _do_print_body: Function;
    add_source_map: Function;
    aborts: Function;
    to_mozilla_ast: Function;
}

export class AST_Default extends AST_SwitchBranch {
    _codegen: Function;
    reduce_vars: Function;
}

export class AST_Case extends AST_SwitchBranch {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    reduce_vars: Function;
    has_side_effects: Function;
    may_throw: Function;
}

export class AST_Try extends AST_Block {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    add_source_map: Function;
    reduce_vars: Function;
    has_side_effects: Function;
    may_throw: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Catch extends AST_Block {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    add_source_map: Function;
    to_mozilla_ast: Function;
}

export class AST_Finally extends AST_Block {
    _codegen: Function;
    add_source_map: Function;
}

export class AST_EmptyStatement extends AST_Statement {
    _codegen: Function;
    has_side_effects: Function;
    may_throw: Function;
    to_mozilla_ast: Function;
}

export class AST_StatementWithBody extends AST_Statement {
    _do_print_body: Function;
    add_source_map: Function;
}

export class AST_LabeledStatement extends AST_StatementWithBody {
    _walk: Function;
    clone: Function;
    transform: Function;
    _codegen: Function;
    add_source_map: Function;
    reduce_vars: Function;
    has_side_effects: Function;
    may_throw: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_IterationStatement extends AST_StatementWithBody {
    clone: Function;
    is_block_scope: Function;
}

export class AST_DWLoop extends AST_IterationStatement {

}

export class AST_Do extends AST_DWLoop {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    reduce_vars: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_While extends AST_DWLoop {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    reduce_vars: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_For extends AST_IterationStatement {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    reduce_vars: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_ForIn extends AST_IterationStatement {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    reduce_vars: Function;
    to_mozilla_ast: Function;
}

export class AST_ForOf extends AST_ForIn {
    to_mozilla_ast: Function;
}

export class AST_With extends AST_StatementWithBody {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_If extends AST_StatementWithBody {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    reduce_vars: Function;
    has_side_effects: Function;
    may_throw: Function;
    aborts: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Jump extends AST_Statement {
    add_source_map: Function;
    aborts: Function;
}

export class AST_Exit extends AST_Jump {
    _walk: Function;
    transform: Function;
    _do_print: Function;
}

export class AST_Return extends AST_Exit {
    _codegen: Function;
    may_throw: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Throw extends AST_Exit {
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_LoopControl extends AST_Jump {
    _walk: Function;
    transform: Function;
    _do_print: Function;
}

export class AST_Break extends AST_LoopControl {
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_Continue extends AST_LoopControl {
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_Definitions extends AST_Statement {
    _walk: Function;
    transform: Function;
    _do_print: Function;
    add_source_map: Function;
    has_side_effects: Function;
    may_throw: Function;
    remove_initializers: Function;
    to_assignments: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Var extends AST_Definitions {
    _codegen: Function;
}

export class AST_Let extends AST_Definitions {
    _codegen: Function;
}

export class AST_Const extends AST_Definitions {
    _codegen: Function;
}

export class AST_Export extends AST_Statement {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_Expansion extends AST_Node {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    _dot_throw: Function;
    drop_side_effect_free: Function;
    to_mozilla_ast: Function;
}

export class AST_Destructuring extends AST_Node {
    _walk: Function;
    all_symbols: Function;
    transform: Function;
    _codegen: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_PrefixedTemplateString extends AST_Node {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_TemplateString extends AST_Node {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    is_string: Function;
    _eval: Function;
    has_side_effects: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_TemplateSegment extends AST_Node {
    has_side_effects: Function;
    drop_side_effect_free: Function;
}

export class AST_NameMapping extends AST_Node {
    _walk: Function;
    transform: Function;
    _codegen: Function;
}

export class AST_Import extends AST_Node {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    aborts: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_VarDef extends AST_Node {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    reduce_vars: Function;
    has_side_effects: Function;
    may_throw: Function;
    to_mozilla_ast: Function;
}

export class AST_Call extends AST_Node {
    _walk: Function;
    transform: Function;
    needs_parens: Function;
    _codegen: Function;
    _eval: Function;
    is_expr_pure: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_New extends AST_Call {
    needs_parens: Function;
    _codegen: Function;
    add_source_map: Function;
    _eval: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Sequence extends AST_Node {
    _walk: Function;
    transform: Function;
    tail_node: Function;
    needs_parens: Function;
    _do_print: Function;
    _codegen: Function;
    _dot_throw: Function;
    is_boolean: Function;
    is_number: Function;
    is_string: Function;
    negate: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_PropAccess extends AST_Node {
    needs_parens: Function;
    _eval: Function;
    flatten_object: Function;
    to_mozilla_ast: Function;
}

export class AST_Dot extends AST_PropAccess {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    _dot_throw: Function;
    _find_defs: Function;
    is_call_pure: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    optimize: Function;
}

export class AST_Sub extends AST_PropAccess {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    optimize: Function;
}

export class AST_Unary extends AST_Node {
    _walk: Function;
    transform: Function;
    needs_parens: Function;
    reduce_vars: Function;
    is_number: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    drop_side_effect_free: Function;
    lift_sequences: Function;
    to_mozilla_ast: Function;
}

export class AST_UnaryPrefix extends AST_Unary {
    _codegen: Function;
    _dot_throw: Function;
    is_boolean: Function;
    is_string: Function;
    _eval: Function;
    negate: Function;
    optimize: Function;
}

export class AST_UnaryPostfix extends AST_Unary {
    _codegen: Function;
    _dot_throw: Function;
    optimize: Function;
}

export class AST_Binary extends AST_Node {
    _walk: Function;
    transform: Function;
    needs_parens: Function;
    _codegen: Function;
    reduce_vars: Function;
    _dot_throw: Function;
    is_boolean: Function;
    is_number: Function;
    is_string: Function;
    _eval: Function;
    negate: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    drop_side_effect_free: Function;
    lift_sequences: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Assign extends AST_Binary {
    needs_parens: Function;
    reduce_vars: Function;
    _dot_throw: Function;
    is_boolean: Function;
    is_number: Function;
    is_string: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_DefaultAssign extends AST_Binary {
    optimize: Function;
}

export class AST_Conditional extends AST_Node {
    _walk: Function;
    transform: Function;
    needs_parens: Function;
    _codegen: Function;
    reduce_vars: Function;
    _dot_throw: Function;
    is_boolean: Function;
    is_number: Function;
    is_string: Function;
    _eval: Function;
    negate: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Array extends AST_Node {
    _walk: Function;
    transform: Function;
    _codegen: Function;
    add_source_map: Function;
    _dot_throw: Function;
    _eval: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Object extends AST_Node {
    _walk: Function;
    transform: Function;
    needs_parens: Function;
    _codegen: Function;
    add_source_map: Function;
    _dot_throw: Function;
    _eval: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_ObjectProperty extends AST_Node {
    _walk: Function;
    transform: Function;
    _print_getter_setter: Function;
    add_source_map: Function;
    _dot_throw: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    drop_side_effect_free: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_ObjectKeyVal extends AST_ObjectProperty {
    _codegen: Function;
    optimize: Function;
}

export class AST_ObjectSetter extends AST_ObjectProperty {
    _codegen: Function;
    add_source_map: Function;
}

export class AST_ObjectGetter extends AST_ObjectProperty {
    _codegen: Function;
    add_source_map: Function;
    _dot_throw: Function;
}

export class AST_ConciseMethod extends AST_ObjectProperty {
    _codegen: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Symbol extends AST_Node {
    mark_enclosed: Function;
    reference: Function;
    unmangleable: Function;
    unreferenced: Function;
    definition: Function;
    global: Function;
    _do_print: Function;
    _codegen: Function;
    add_source_map: Function;
    fixed_value: Function;
    to_mozilla_ast: Function;
}

export class AST_SymbolDeclaration extends AST_Symbol {
    _find_defs: Function;
    has_side_effects: Function;
    may_throw: Function;
}

export class AST_SymbolVar extends AST_SymbolDeclaration {

}

export class AST_SymbolFunarg extends AST_SymbolVar {

}

export class AST_SymbolBlockDeclaration extends AST_SymbolDeclaration {

}

export class AST_SymbolConst extends AST_SymbolBlockDeclaration {

}

export class AST_SymbolLet extends AST_SymbolBlockDeclaration {

}

export class AST_SymbolDefClass extends AST_SymbolBlockDeclaration {

}

export class AST_SymbolCatch extends AST_SymbolBlockDeclaration {
    reduce_vars: Function;
}

export class AST_SymbolImport extends AST_SymbolBlockDeclaration {

}

export class AST_SymbolDefun extends AST_SymbolDeclaration {

}

export class AST_SymbolLambda extends AST_SymbolDeclaration {

}

export class AST_SymbolClass extends AST_SymbolDeclaration {

}

export class AST_SymbolMethod extends AST_Symbol {

}

export class AST_SymbolImportForeign extends AST_Symbol {

}

export class AST_Label extends AST_Symbol {
    initialize: Function;
    unmangleable: Function;
}

export class AST_SymbolRef extends AST_Symbol {
    reduce_vars: Function;
    is_immutable: Function;
    is_declared: Function;
    _dot_throw: Function;
    _find_defs: Function;
    _eval: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    optimize: Function;
}

export class AST_SymbolExport extends AST_SymbolRef {
    optimize: Function;
}

export class AST_SymbolExportForeign extends AST_Symbol {

}

export class AST_LabelRef extends AST_Symbol {

}

export class AST_This extends AST_Symbol {
    _codegen: Function;
    has_side_effects: Function;
    may_throw: Function;
    drop_side_effect_free: Function;
    to_mozilla_ast: Function;
}

export class AST_Super extends AST_This {
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_NewTarget extends AST_Node {
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_Constant extends AST_Node {
    getValue: Function;
    _codegen: Function;
    add_source_map: Function;
    _dot_throw: Function;
    _eval: Function;
    has_side_effects: Function;
    may_throw: Function;
    is_constant_expression: Function;
    drop_side_effect_free: Function;
    to_mozilla_ast: Function;
}

export class AST_String extends AST_Constant {
    _codegen: Function;
    is_string: Function;
}

export class AST_Number extends AST_Constant {
    needs_parens: Function;
    _codegen: Function;
    is_number: Function;
}

export class AST_RegExp extends AST_Constant {
    _codegen: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_Atom extends AST_Constant {
    to_mozilla_ast: Function;
}

export class AST_Null extends AST_Atom {
    value: object;
    _dot_throw: Function;
    to_mozilla_ast: Function;
}

export class AST_NaN extends AST_Atom {
    value: number;
    optimize: Function;
}

export class AST_Undefined extends AST_Atom {
    value: any;
    _dot_throw: Function;
    optimize: Function;
}

export class AST_Hole extends AST_Atom {
    value: any;
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_Infinity extends AST_Atom {
    value: number;
    optimize: Function;
}

export class AST_Boolean extends AST_Atom {
    optimize: Function;
    to_mozilla_ast: Function;
}

export class AST_False extends AST_Boolean {
    value: boolean;
    is_boolean: Function;
}

export class AST_True extends AST_Boolean {
    value: boolean;
    is_boolean: Function;
}

export class AST_Await extends AST_Node {
    _walk: Function;
    transform: Function;
    needs_parens: Function;
    _codegen: Function;
    to_mozilla_ast: Function;
}

export class AST_Yield extends AST_Node {
    _walk: Function;
    transform: Function;
    needs_parens: Function;
    _codegen: Function;
    optimize: Function;
    to_mozilla_ast: Function;
}
