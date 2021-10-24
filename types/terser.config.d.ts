/**
 * @see https://github.com/terser/terser
 */
type ecma = 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020

interface parse {
	/**
	 * @description Support top level `return` statements.
	 * @default false
	 */
	bare_returns?: false
	
	/**
	 * @default true
	 */
	html5_comments?: true
	
	/**
	 * @description Support `#!command` as the first line.
	 * @default true
	 */
	shebang?: true
	
	/**
	 * @description Accept a Spidermonkey (Mozilla) AST.
	 * @default false
	 */
	spidermonkey?: false
}

interface compress {
	/**
	 * @description Pass `false` to disable most default enabled `compress` transforms. Useful when you only want to enable a few `compress` options while disabling the rest.
	 * @default true
	 * @see {@link computed_props}, {@link typeofs}, {@link unsafe}, {@link unsafe_arrows}, {@link unsafe_methods}
	 */
	defaults?: boolean
	
	/**
	 * @description Class and object literal methods are converted will also be converted to arrow expressions if the resultant code is shorter: `m(){return x}` becomes `m:()=>x`. To do this to regular ES5 functions which don't use `this` or `arguments`.
	 * @default true
	 * @see {@link unsafe_arrows}
	 */
	arrows?: boolean
	
	/**
	 * @description Replace `arguments[index]` with function parameter name whenever possible.
	 * @default false
	 */
	arguments?: boolean
	
	/**
	 * @description Various optimizations for boolean context, for example `!!a ? b : c → a ? b : c`.
	 * @default true
	 */
	booleans?: boolean
	
	/**
	 * @description Turn booleans into 0 and 1, also makes comparisons with booleans use `==` and `!=` instead of `===` and `!==`.
	 * @default false
	 */
	booleans_as_integers?: boolean
	
	/**
	 * @description Collapse single-use non-constant variables, side effects permitting.
	 * @default true
	 */
	collapse_vars?: boolean
	
	/**
	 * @description Apply certain optimizations to binary nodes, e.g. `!(a <= b) → a > b` (only when {@link unsafe_comps}), attempts to negate binary nodes, e.g. `a = !b && !c && !d && !e → a=!(b||c||d||e)` etc.
	 * @default true
	 */
	comparisons?: boolean
	
	/**
	 * @description Transforms constant computed properties into regular ones: `{["computed"]: 1}` is converted to `{computed: 1}`.
	 * @default true
	 */
	computed_props?: boolean
	
	/**
	 * @description Apply optimizations for `if`s and conditional expressions.
	 * @default true
	 */
	conditionals?: boolean
	
	/**
	 * @description Remove unreachable code.
	 * @default true
	 */
	dead_code?: boolean
	
	/**
	 * @description Remove redundant or non-standard directives.
	 * @default true
	 */
	directives?: boolean
	
	/**
	 * @description Pass `true` to discard calls to `console.*` functions. If you wish to drop a specific function call such as `console.info` and/or retain side effects from function arguments after dropping the function call then use {@link pure_funcs} instead.
	 * @default false
	 */
	drop_console?: boolean
	
	/**
	 * @description Remove `debugger;` statements.
	 * @default true
	 */
	drop_debugger?: boolean
	
	/**
	 * @description Pass `2015` or greater to enable `compress` options that will transform ES5 code into smaller ES6+ equivalent forms.
	 * @default 5
	 */
	ecma?: ecma
	
	/**
	 * @description Attempt to evaluate constant expressions.
	 * @default true
	 */
	evaluate?: boolean
	
	/**
	 * @description Pass `true` to preserve completion values from terminal statements without `return`, e.g. in bookmarklets.
	 * @default false
	 */
	expression?: boolean
	
	/**
	 * @description Helps with conditional compilation.
	 * @default {}
	 * @see [Conditional Compilation](https://github.com/terser/terser#conditional-compilation).
	 * @example
	 * // You can also use conditional compilation via the programmatic API. With the difference that the property name is `global_defs` and is a compressor property.
	 * var result = await minify(fs.readFileSync("input.js", "utf8"), {
	 *     compress: {
	 *         dead_code: true,
	 *         global_defs: {
	 *             DEBUG: false
	 *         }
	 *     }
	 * });
	 *
	 * @example
	 * // To replace an identifier with an arbitrary non-constant expression it is necessary to prefix the `global_defs` key with `"@"` to instruct Terser to parse the value as an expression:
	 * await minify("alert('hello');", {
	 *     compress: {
	 *         global_defs: {
	 *             "@alert": "console.log"
	 *         }
	 *     }
	 * }).code;
	 * // returns: 'console.log("hello");
	 * 
	 * @example
	 * // Otherwise it would be replaced as string literal:
	 * await minify("alert('hello');", {
	 *     compress: {
	 *         global_defs: {
	 *             "alert": "console.log"
	 *         }
	 *     }
	 * }).code;
	 * // returns: "console.log"("hello");
	 */
	global_defs?: Record<string, string | boolean>
	
	/**
	 * @description Hoist function declarations.
	 * @default false
	 */
	hoist_funs?: boolean
	
	/**
	 * @description Hoist properties from constant object and array literals into regular variables subject to a set of constraints.
	 * @default true
	 * @example var o={p:1, q:2}; f(o.p, o.q);` is converted to `f(1, 2);
	 * @note `hoist_props` works best with {@link mangle} enabled, the {@link compress.passes} set to `2` or higher, and the {@link compress.toplevel} enabled.
	 */
	hoist_props?: boolean
	
	/**
	 * @description Hoist `var` declarations (this is `false` by default because it seems to increase the size of the output in general).
	 * @default false
	 */
	hoist_vars?: false
	
	/**
	 * @description Optimizations for `if`/`return` and `if`/`continue`.
	 * @default true
	 */
	if_return?: boolean
	
	/**
	 * @description Inline calls to function with simple `return` statement:
	 * - `false` -- same as `0`
	 * - `0` -- Disabled inlining.
	 * - `1` -- Inline simple functions.
	 * - `2` -- Inline functions with arguments.
	 * - `3` -- Inline functions with arguments and variables.
	 * - `true` -- Same as `3`.
	 * @default true
	 */
	inline?: boolean | 0 | 1 | 2 | 3
	
	/**
	 * @description Join consecutive `var` statements.
	 * @default true
	 */
	join_vars?: boolean
	
	/**
	 * @description Pass `true` to prevent the compressor from discarding class names. Pass a regular expression to only keep class names matching that regex.
	 * @default false
	 * @see {@link mangle.keep_classnames}
	 */
	keep_classnames?: boolean | RegExp
	
	/**
	 * @description Prevents the compressor from discarding unused function arguments You need this for code which relies on `Function.length`.
	 * @default true
	 */
	keep_fargs?: boolean
	
	/**
	 * @description Pass `true` to prevent the compressor from discarding function names. Pass a regular expression to only keep function names matching that regex. Useful for code relying on `Function.prototype.name`.
	 * @default false
	 * @see {@link mangle.keep_fnames}
	 */
	keep_fnames?: boolean
	
	/**
	 * @description Pass `true` to prevent `Infinity` from being compressed into `1/0`, which may cause performance issues on Chrome.
	 * @default false
	 */
	keep_infinity?: boolean
	
	/**
	 * @description Optimizations for `do`, `while` and `for` loops when we can statically determine the condition.
	 * @default true
	 */
	loops?: boolean
	
	/**
	 * @description Pass `true` when compressing an ES6 module. Strict mode is implied and the {@link toplevel} option as well.
	 * @default false
	 */
	module?: boolean
	
	/**
	 * @description Negate "Immediately-Called Function Expressions" where the return value is discarded, to avoid the parens that the code generator would insert.
	 * @default true
	 */
	negate_iife?: boolean
	
	/**
	 * @type Must be positive integer
	 * @description The maximum number of times to run compress. In some cases more than one pass leads to further compressed code. Keep in mind more passes will take more time.
	 * @default 1
	 */
	passes?: number
	
	/**
	 * @description Rewrite property access using the dot notation, for example `foo["bar"] -> foo.bar`.
	 * @default true
	 */
	properties?: boolean
	
	/**
	 * @description You can pass an array of names and Terser will assume that those functions do not produce side effects
	 * 
	 * An example case here, for instance `var q = Math.floor(a/b)` If variable `q` is not used elsewhere, Terser will drop it, but will still keep the `Math.floor(a/b)`, not knowing what it does You can pass `pure_funcs: [ 'Math.floor' ]` to let it know that this function won't produce any side effect, in which case the whole statement would get discarded The current implementation adds some overhead (compression will be slower).
	 * @default null
	 * @note Sill not check if the name is redefined in scope.
	 */
	pure_funcs?: null | string[]
	
	/**
	 * @description If you pass `true` for this, Terser will assume that object property access (e.g. `foo.bar` or `foo["bar"]`) doesn't have any side effects. Specify `"strict"` to treat `foo.bar` as side-effect-free only when `foo` is certain to not throw, i.e. not `null` or `undefined`.
	 * @default "strict"
	 */
	pure_getters?: "strict" | boolean
	
	/**
	 * @description Improve optimization on variables assigned with and used as constant values.
	 * @default true
	 */
	reduce_vars?: boolean
	
	/**
	 * @description Inline single-use functions when possible. Depends on {@link reduce_vars} being enabled. Disabling this option sometimes improves performance of the output code.
	 * @default true
	 */
	reduce_funcs?: boolean
	
	/**
	 * @types positive integer
	 * @description Join consecutive simple statements using the comma operator May be set to a positive integer to specify the maximum number of consecutive comma sequences that will be generated. If this option is set to `true` then the default `sequences` limit is `200`. Set option to `false` or `0` to disable. The smallest `sequences` length is `2`. A `sequences` value of `1` is grandfathered to be equivalent to `true` and as such means `200`. On rare occasions the default sequences limit leads to very slow compress times in which case a value of `20` or less is recommended.
	 * @default true
	 */
	sequences?: boolean | number
	
	/**
	 * @description Remove expressions which have no side effects and whose results aren't used.
	 * @default true
	 */
	side_effects?: boolean
	
	/**
	 * @description De-duplicate and remove unreachable `switch` branches.
	 * @default true
	 */
	switches?: boolean
	
	/**
	 * @description Drop unreferenced functions (`"funcs"`) and/or variables (`"vars"`) in the top level scope (`false` by default, `true` to drop both unreferenced functions and variables).
	 * @default false
	 */
	toplevel?: boolean
	
	/**
	 * @description Prevent specific {@link toplevel} functions and variables from {@link unused} removal (can be array, comma-separated, RegExp or function. Implies `toplevel`).
	 * @default null
	 * 
	 * TODO: figure out function type
	 */
	top_retain?: null | string[] | string | RegExp | Function
	
	/**
	 * @description Transforms `typeof foo == "undefined"` into `foo === void 0`
	 * @default true
	 * @note Recommend to set this value to `false` for IE10 and earlier versions due to known issues.
	 */
	typeofs?: boolean
	
	/**
	 * @description Apply "unsafe" transformations ([details](https://github.com/terser/terser#the-unsafe-compress-option)).
	 * @default false
	 */
	unsafe?: boolean
	
	/**
	 * @description Convert ES5 style anonymous function expressions to arrow functions if the function body does not reference `this`.
	 * @default false
	 * @note It is not always safe to perform this conversion if code relies on the the function having a `prototype`, which arrow functions lack. This transform requires that the {@link ecma} compress option is set to `2015` or greater.
	 */
	unsafe_arrows?: boolean
	
	/**
	 * @description Reverse `<` and `<=` to `>` and `>=` to allow improved compression. This might be unsafe when an at least one of two operands is an object with computed values due the use of methods like `get`, or `valueOf`. This could cause change in execution order after operands in the comparison are switching. Compression only works if both {@link comparisons} and {@link unsafe_comps} are both set to true.
	 * @default false
	 */
	unsafe_comps?: boolean
	
	/**
	 * @description Compress and mangle `Function(args, code)` when both `args` and `code` are string literals.
	 * @default false
	 */
	unsafe_Function?: boolean
	
	/**
	 * @description Optimize numerical expressions like `2 * x * 3` into `6 * x`, which may give imprecise floating point results.
	 * @default false
	 */
	unsafe_math?: boolean
	
	/**
	 * @description Removes keys from native Symbol declarations, e.g `Symbol("kDog")` becomes `Symbol()`.
	 * @default false
	 */
	unsafe_symbols?: boolean
	
	/**
	 * @description Converts `{ m: function(){} }` to `{ m(){} }`. `ecma` must be set to `6` or greater to enable this transform. If {@link unsafe_methods} is a RegExp then key/value pairs with keys matching the RegExp will be converted to concise methods.
	 * @default false
	 * @note If enabled there is a risk of getting a "`<method name>` is not a constructor" TypeError should any code try to `new` the former function.
	 */
	unsafe_methods?: boolean | RegExp
	
	/**
	 * @description Optimize expressions like `Array.prototype.slice.call(a)` into `[].slice.call(a)`.
	 * @default false
	 */
	unsafe_proto?: boolean
	
	/**
	 * @description Enable substitutions of variables with `RegExp` values the same way as if they are constants.
	 * @default false
	 */
	unsafe_regexp?: boolean
	
	/**
	 * @description Substitute `void 0` if there is a variable named `undefined` in scope (variable name will be mangled, typically reduced to a single character).
	 * @default false
	 */
	unsafe_undefined?: boolean
	
	/**
	 * @description Drop unreferenced functions and variables (simple direct variable assignments do not count as references unless set to `"keep_assign"`).
	 * @default true
	 */
	unused?: boolean | "keep_assign"
}

interface mangle {
	/**
	 * @description Pass `true` to mangle names visible in scopes where `eval` or `with` are used.
	 * @default false
	 */
	eval?: boolean
	
	/**
	 * @description Pass `true` to not mangle class names. Pass a regular expression to only keep class names matching that regex.
	 * @default false
	 * @see {@link compress.keep_classnames}
	 */
	keep_classnames?: boolean | RegExp
	
	/**
	 * @description Pass `true` to not mangle function names. Pass a regular expression to only keep function names matching that regex. Useful for code relying on `Function.prototype.name`.
	 * @default false
	 * @see {@link compress.keep_fnames}
	 */
	keep_fnames?: boolean | RegExp
	
	/**
	 * @description Pass `true` an ES6 modules, where the `toplevel` scope is not the global scope. Implies {@link toplevel}.
	 * @default false
	 */
	module?: boolean
	
	/**
	 * @description Pass an object with a `get(n)` function that converts an ordinal into the nth most favored (usually shortest) identifier. Optionally also provide `reset()`, `sort()`, and `consider(chars, delta)` to use character frequency analysis of the source code.
	 * @default an internal mangler that weights based on character frequency analysis
	 * 
	 * TODO: fix type
	 */
	nth_identifier?: any
	
	/**
	 * @description Pass an array of identifiers that should be excluded from mangling.
	 * @default []
	 * @example ["foo", "bar"]
	 */
	reserved?: string[]
	
	/**
	 * @description Pass `true` to mangle names declared in the top level scope.
	 * @default false
	 */
	toplevel?: boolean
	
	/**
	 * @description Pass `true` to work around the Safari 10 loop iterator
	 * @default false
	 * @bug ["Cannot declare a let variable twice"](https://bugs.webkit.org/show_bug.cgi?id=171041).
	 * @see {@link format.safari10}
	 */
	safari10?: boolean
	
	/**
	 * @description A subcategory of the mangle option. Pass an object to specify custom {@link mangle} property options.
	 * @default false
	 */
	properties?: boolean | {
		/**
		 * @description Use `true` to allow the mangling of builtin DOM properties. Not recommended to override this setting.
		 * @default false
		 */
		builtins?: boolean
		
		/**
		 * @description Mangle names with the original name still present. Pass an empty string `""` to enable, or a non-empty string to set the debug suffix.
		 * @default false
		 */
		debug?: boolean | string
		
		/**
		 * @description How quoting properties (`{"prop": ...}` and `obj["prop"]`) controls what gets mangled.
		 * - `"strict"` (recommended) -- `obj.prop` is mangled.
		 * - `false` -- `obj["prop"]` is mangled.
		 * - `true` -- `obj.prop` is mangled unless there is `obj["prop"]` elsewhere in the code.
		 * @default false
		 */
		keep_quoted?: boolean | "strict"
		
		/**
		 * @description Pass an object with a `get(n)` function that converts an ordinal into the nth most favored (usually shortest) identifier. Optionally also provide `reset()`, `sort()`, and `consider(chars, delta)` to use character frequency analysis of the source code.
		 * @default an internal mangler that weights based on character frequency analysis
		 * 
		 * TODO: fix type
		 */
		nth_identifer?: any
		
		/**
		 * @description Pass a [RegExp literal or pattern string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) to only mangle property matching the regular expression.
		 * @default null
		 */
		regex?: null | RegExp | string
		
		/**
		 * @description Do not mangle property names listed in the `reserved` array.
		 * @default []
		 */
		reserved?: string[]
		
		/**
		 * @description Mangle those names when they are accessed as properties of known top level variables but their declarations are never found in input code. May be useful when only minifying parts of a project.
		 * @default false
		 * @see [#397](https://github.com/terser/terser/issues/397) for more details.
		 */
		undeclared?: boolean
	}
}

interface format {
	/**
	 * @description Escape Unicode characters in strings and regexps (affects directives with non-ascii characters becoming invalid).
	 * @default false
	 */
	ascii_only?: boolean
	
	/**
	 * @deprecated
	 * @description whether to beautify the output. When using the legacy `-b` CLI flag, this is set to true by default.
	 * @default false
	 */
	beautify?: boolean
	
	/**
	 * @description Always insert braces in `if`, `for`, `do`, `while` or `with` statements, even if their body is a single statement.
	 * @default false
	 */
	braces?: boolean
	
	/**
	 * @description By default it keeps JSDoc-style comments that contain "@license", "@preserve" or start with `!`, pass `true` or `"all"` to preserve all comments, `false` to omit comments in the output, a regular expression string (e.g. `/^!/`) or a function.
	 * @default "some"
	 * 
	 * TODO: figure out Function type
	 */
	comments?: boolean | "some" | "all" | string | Function
	
	/**
	 * @description Set desired EcmaScript standard version for output. Set `ecma` to `2015` or greater to emit shorthand object properties - i.e.: `{a}` instead of `{a: a}`. The {@link ecma} option will only change the output in direct control of the beautifier. Non-compatible features in your input will still be output as is. For example: an `ecma` setting of `5` will **not** convert modern code to ES5.
	 * @default 5
	 */
	ecma?: ecma
	
	/**
	 * @type positive integer
	 * @default 4
	 */
	indent_level?: number
	
	/**
	 * @type positive integer
	 * @description Prefix all lines by that many spaces.
	 * @default 0
	 */
	indent_start?: number
	
	/**
	 * @description Escape HTML comments and the slash in occurrences of `</script>` in strings.
	 * @default true
	 */
	inline_script?: boolean
	
	/**
	 * @description Keep number literals as it was in original code (disables optimizations like converting `1000000` into `1e6`).
	 * @default false
	 */
	keep_numbers?: boolean
	
	/**
	 * @description When turned on, prevents stripping quotes from property names in object literals.
	 * @default false
	 */
	keep_quoted_props?: boolean
	
	/**
	 * @description Maximum line length (for minified code).
	 * @default false
	 */
	max_line_len?: boolean
	
	/**
	 * @description When passed it must be a string and it will be prepended to the output literally. The source map will adjust for this text. Can be used to insert a comment containing licensing information, for example.
	 * @default null
	 */
	preamble?: null | string
	
	/**
	 * @description Pass `true` to quote all keys in literal objects.
	 * @default false
	 */
	quote_keys?: boolean
	
	/**
	 * @description Preferred quote style for strings (affects quoted property names and directives as well):
	 * - `0` -- Prefers double quotes, switches to single quotes when there are more double quotes in the string itself. `0` is best for gzip size.
	 * - `1` -- Always use single quotes.
	 * - `2` -- Always use double quotes.
	 * - `3` -- Always use the original quotes.
	 * @default 0
	 */
	quote_style?: 0 | 1 | 2 | 3
	
	/**
	 * @description Preserve [Terser annotations](https://github.com/terser/terser#annotations) in the output.
	 * @default false
	 */
	preserve_annotations?: boolean
	
	/**
	 * @description Set this option to `true` to work around the [Safari 10/11 await bug](https://bugs.webkit.org/show_bug.cgi?id=176685).
	 * @default false
	 * @see {@link mangle.safari10}
	 */
	safari10?: boolean
	
	/**
	 * @description Separate statements with semicolons. If you pass `false` then whenever possible we will use a newline instead of a semicolon, leading to more readable output of minified code (size before gzip could be smaller; size after gzip insignificantly larger).
	 * @default true
	 */
	semicolons?: boolean
	
	/**
	 * @description Preserve shebang `#!` in preamble (bash scripts).
	 * @default true
	 */
	shebang?: boolean
	
	/**
	 * @description Produce a Spidermonkey (Mozilla) AST.
	 * @default false
	 */
	spidermonkey?: boolean
	
	/**
	 * @description Enable workarounds for WebKit bugs. PhantomJS users should set this option to `true`.
	 * @default false
	 */
	webkit?: boolean
	
	/**
	 * @description Pass `true` to wrap immediately invoked function expressions.
	 * @default false
	 * @see [#640](https://github.com/mishoo/UglifyJS2/issues/640)
	 */
	wrap_iife?: boolean
	
	/**
	 * @description Pass `false` if you do not want to wrap function expressions that are passed as arguments, in parenthesis.
	 * @default true
	 * @see [OptimizeJS](https://github.com/nolanlawson/optimize-js)
	 */
	wrap_func_args?: boolean
}

/**
 * @description Note that the source map is not saved in a file, it's just returned in `result.map`. The value passed for {@link sourceMap.url} is only used to set `//# sourceMappingURL=out.js.map` in `result.code`. The value of filename is only used to set file attribute (see the [spec](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k)) in source map file.
 */
interface sourceMap {
	filename?: string,
	url?: "inline" | string,
	
	/**
	 * @description You can also specify {@link sourceMap.root} property to be included in source map.
	 * @example
	 * var result = await minify({"file1.js": "var a = function() {};"}, {
	 *     sourceMap: {
	 *         root: "http://example.com/src",
	 *         url: "out.js.map"
	 *     }
	 * });
	 */
	root?: string,
	
	/**
	 * @description If you're compressing compiled JavaScript and have a source map for it, you can use {@link sourceMap.content}.
	 * @example
	 * var result = await minify({"compiled.js": "compiled code"}, {
	 *     sourceMap: {
	 *         content: "content from compiled.js.map",
	 *         url: "minified.js.map"
	 *     }
	 * });
	 * // same as before, it returns `code` and `map`
	 */
	content?: string,
	
	/**
	 * @description If you happen to need the source map as a raw object, set {@link sourceMap.asObject} to `true`.
	 * @default false
	 */
	asObject?: boolean,
}

interface terserSchema {
	/**
	 * @description Pass `5`, `2015`, `2016`, etc to override `compress` and `format`'s `ecma` options.
	 * @default undefined
	 * */
	ecma?: ecma,
	
	/**
	 * @description Pass `true`, or a `string` in the format of `"args[:values]"`, where `args` and `values` are comma-separated argument names and values, respectively, to embed the output in a big function with the configurable arguments and values.
	 * @default false
	 */
	enclose?: boolean | string,
	
	/**
	 * @description Pass an object if you wish to specify some additional parse options.
	 * @default {}
	 */
	parse?: parse,
	
	/**
	 * @description Pass `false` to skip compressing entirely. Pass an object to specify custom compress options.
	 * @default {}
	 */
	compress: false | compress,
	
	/**
	 * @description Pass `false` to skip mangling names, or pass an object to specify {@link mangle} options.
	 * @default true
	 */
	mangle?: false | mangle,
	
	/**
	 * @description Use when minifying an ES6 module. `"use strict"` is implied and names can be mangled on the top scope. If {@link compress} or {@link mangle} is enabled then the {@link terserSchema.topLevel} option will be enabled.
	 * @default false
	 */
	module?: boolean,
	
	/**
	 * @description Pass an object if you wish to specify additional {@link format} options. The defaults are optimized for best compression.
	 * @default null
	 */
	format?: null | format,
	
	/** @alias {@link format} */
	output?: null | format,
	
	/**
	 * @description Pass an object if you wish to specify {@link sourceMap} options
	 * @default false
	 */
	sourceMap?: false | sourceMap,
	
	/**
	 * @description Set to `true` if you wish to enable top level variable and function name mangling and to drop unused variables and functions.
	 * @default false
	 */
	topLevel?: boolean,
	
	/**
	 * @description pass an empty object `{}` or a previously used `nameCache` object if you wish to cache mangled variable and property names across multiple invocations of `minify()`.
	 * @note This is a read / write property. `minify()` will read the name cache state of this object and update it during minification so that it may be reused or externally persisted by the user.
	 * @default null
	 * 
	 * TODO: figure out type of this
	 */
	nameCache?: null | {} | any,
	
	/**
	 * @description Set to `true` to support IE8.
	 * @default false
	 */
	ie8?: boolean,
	
	/**
	 * @description Pass `true` to prevent discarding or mangling of class names. Pass a regular expression to only keep class names matching that regex.
	 * @default undefined
	 */
	name_classnames?: boolean | RegExp,
	
	/**
	 * @description Pass `true` to prevent discarding or mangling of function names. Pass a regular expression to only keep function names matching that regex. Useful for code relying on `Function.prototype.name`. If the top level minify option `keep_classnames` is `undefined` it will be overridden with the value of the top level minify option `keep_fnames`.
	 * @default false
	 */
	keep_fnames?: boolean | RegExp,
	
	/**
	 * @description Pass `true` to work around Safari 10 / 11 bugs in loop scoping and `await`.
	 * @default false
	 * @see {@link mangle.safari10}, {@link format.safari10} 
	 */
	safari10?: boolean,
}

export default terserSchema