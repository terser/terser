/* globals module, __dirname, console */
import "source-map-support/register.js";
import path from "path";
import fs from "fs";
import child_process from "child_process";
import assert from "assert";
import semver from "semver";
import { fileURLToPath } from "url";

import { minify } from "../main.js";
import * as AST from "../lib/ast.js";
import { parse } from "../lib/parse.js";
import { OutputStream } from "../lib/output.js";
import { Compressor } from "../lib/compress/index.js";
import {
    reserve_quoted_keys,
    mangle_properties,
    mangle_private_properties,
} from "../lib/propmangle.js";
import { base54 } from "../lib/scope.js";
import { string_template, defaults } from "../lib/utils/index.js";

import * as sandbox from "./sandbox.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var tests_dir = __dirname;
var failed_files = {};
var minify_options = JSON.parse(fs.readFileSync(path.join(__dirname, "ufuzz.json"), 'utf-8')).map(JSON.stringify);

const already_logged = new Set()
try_run_compress_tests_in_parallel().catch(e => {
    console.error(e);
    process.exit(1);
});

/* -----[ utils ]----- */

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function tmpl() {
    return string_template.apply(this, arguments);
}

function log(test, ...args) {
    if (test) log_test(test);
    var txt = tmpl.apply(this, args);
    console.log("%s", txt);
}

function log_directory(dir, extra = '') {
    log(null, "*** Entering [{dir}]{extra}", { dir, extra });
}

function log_test(test) {
    if (already_logged.has(test)) return
    already_logged.add(test)
    log(null, "--- Running test [{name}]", { name: test.name });
    log(null, "    {file}", { file: test.file });
}

function log_test_result({ test_failures, failed_files, test_cases }) {
    if (test_failures) {
        console.error("\n!!! Failed " + test_failures + " test cases.");
        console.error("!!! " + Object.keys(failed_files).join(", "));
        process.exit(1);
    } else {
        console.log("\nPassed " + test_cases + " test cases.");
    }
}

function find_test_files() {
    var dir = test_directory("compress");
    var files = fs.readdirSync(dir).filter(function(name) {
        return /\.js$/i.test(name);
    });
    if (process.argv.length > 2) {
        var x = process.argv.slice(2);
        files = files.filter(function(f) {
            return x.includes(f);
        });
    }
    return files;
}

function test_directory(dir) {
    return path.resolve(tests_dir, dir);
}

function as_template_string_code(ast) {
    if (
        ast instanceof AST.AST_SimpleStatement
        && ast.body instanceof AST.AST_TemplateString
        && ast.body.segments.length === 1
    ) {
        return ast.body.segments[0].value;
    }
}

function as_toplevel(test, input, mangle_options) {
    var toplevel, tpl_input;
    if (input instanceof AST.AST_BlockStatement) {
        for (var i = 0; i < input.body.length; i++) {
            var stat = input.body[i];
            if (stat instanceof AST.AST_SimpleStatement && stat.body instanceof AST.AST_String)
                input.body[i] = new AST.AST_Directive(stat.body);
            else break;
        }
        var toplevel = new AST.AST_Toplevel(input);
    } else if (
        (tpl_input = as_template_string_code(input))
    ) {
        try {
            var toplevel = parse(tpl_input);
        } catch (error) {
            log(test, "!!! Cannot parse input\n---INPUT---\n{input}\n--PARSE ERROR--\n{error}\n\n", {
                input: tpl_input,
                error,
            });
            return null;
        }
    } else {
        log(test, "Unsupported input syntax");
        return null;
    }
    toplevel.figure_out_scope(mangle_options);
    return toplevel;
}

async function try_run_compress_tests_in_parallel() {
    if (!await run_compress_tests_in_parallel()) {
        run_compress_tests();
    }
}

// If possible, use worker threads to run tests in parallel
async function run_compress_tests_in_parallel() {
    if (process.env.TEST_NO_WORKER) {
        return undefined;
    }
    const test_files = find_test_files();
    if (test_files.length < 2) {
        return undefined; // Run this in series
    }

    if (process.send) {
        // We are in the fork!

        // do one test, ask for more, repeat
        process.on('message', async (filename) => {
            try {
                const test_result = await run_compress_tests([filename], true);
                process.send({ test_result }); // request work
            } catch (error) {
                console.error(error);
                process.exit(1);
            }
        });

        process.send({}); // request the first piece

        return true;
    }

    const test_files_work = test_files.map(filename => ({
        filename,
        output: [],
        test_result: null,
        done: false,
    }));

    function proxy_output() {
        const proxy = ([ stream, data ]) => {
            process[stream].write(data);
        };

        for (const task of test_files_work) {
            if (task.output.length) {
                task.output.forEach(proxy);
                task.output = []
            }

            if (!task.done) {
                // This is the last task in series. Live-log it!
                // task.output = { length: 0, push: proxy };
                return;
            }
        }
    }

    async function start_worker() {
        let fork = child_process.fork(__filename, [], {
            stdio: [null, 'pipe', 'pipe', 'ipc'],
        });

        let work_promise = new Promise((resolve, reject) => {
            let current_task
            let get_task = () => test_files_work
                .find(task => task.filename === current_task)

            fork.on("message", ({ test_result }) => {
                proxy_output();

                // absent in the first message
                if (test_result) {
                    get_task().test_result = test_result;
                    get_task().done = true;
                }

                current_task = test_files.shift();
                if (current_task) {
                    fork.send(current_task);
                } else {
                    resolve();
                }
            });
            fork.stdout.on('data', data => {
                get_task().output.push(['stdout', data])
                proxy_output();
            });
            fork.stderr.on('data', data => {
                get_task().output.push(['stderr', data])
                proxy_output();
            });
            fork.on('error', reject);
            fork.on('disconnect', reject);
        });

        try {
            return await work_promise;
        } finally {
            fork.kill();
        }
    }

    const n_workers = Math.min(test_files.length, 2);
    const workers_promises = Promise.all(
        Array.from({ length: n_workers }, start_worker),
    );

    log_directory("test/compress", " with " + n_workers + " workers");

    // Join all
    try {
        await workers_promises;
    } catch (error) {
        console.error('!!! Fatal error while running tests');

        process.exitCode = 1;
        return true;
    }

    const joint_result = test_files_work
        .map(t => t.test_result)
        .reduce(
            (a, b) => {
                if (b) {
                    a.test_cases += b.test_cases;
                    a.test_failures += b.test_failures;
                    Object.assign(a.failed_files, b.failed_files);
                }
                return a;
            },
            {
                test_cases: 0,
                test_failures: 0,
                failed_files: {},
            }
        );

    log_test_result(joint_result);

    return true;
}

async function run_compress_tests(test_files, in_child_process) {
    var test_failures = 0;
    var test_cases = 0;
    const enable_js_sandbox =
        !process.env.TEST_NO_SANDBOX && semver.satisfies(process.version, ">=16")

    var dir = test_directory("compress");
    if (!in_child_process) log_directory("test/compress");
    var files = test_files || find_test_files();
    async function test_file(file) {
        async function test_case(test) {
            var output_options = test.beautify || test.format || {};
            var expect;
            if (test.expect) {
                let toplevel = as_toplevel(test, test.expect, test.mangle);
                if (!toplevel) return false;
                expect = make_code(toplevel, output_options);
            } else {
                expect = test.expect_exact;
            }
            if (test.expect_error && (test.expect || test.expect_exact || test.expect_stdout)) {
                log(test, "!!! Test cannot have an `expect_error` with other expect clauses\n", {});
                return false;
            }
            var bad_input = as_template_string_code(test.bad_input);
            if (bad_input != null) {
                try {
                    var input = parse(bad_input);
                } catch (ex) {
                    if (!test.expect_error) {
                        log(test, "!!! Test is missing an `expect_error` clause\n", {});
                        return false;
                    }
                    if (test.expect_error instanceof AST.AST_SimpleStatement
                    && test.expect_error.body instanceof AST.AST_Object) {
                        var expect_error = eval("(" + test.expect_error.body.print_to_string() + ")");
                        var ex_normalized = JSON.parse(JSON.stringify(ex));
                        ex_normalized.name = ex.name;
                        for (var prop in expect_error) {
                            if (prop == "name" || HOP(expect_error, prop)) {
                                if (expect_error[prop] != ex_normalized[prop]) {
                                    log(test, "!!! Failed `expect_error` property `{prop}`:\n\n---expect_error---\n{expect_error}\n\n---ACTUAL exception--\n{actual_ex}\n\n", {
                                        prop: prop,
                                        expect_error: JSON.stringify(expect_error, null, 2),
                                        actual_ex: JSON.stringify(ex_normalized, null, 2),
                                    });
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    log(test, "!!! Test `expect_error` clause must be an object literal\n---expect_error---\n{expect_error}\n\n", {
                        expect_error: test.expect_error.print_to_string(),
                    });
                    return false;
                }
                var input_code = make_code(input, output_options);
                var input_formatted = bad_input;
            } else if (test.expect_error) {
                log(test, "!!! Test cannot have an `expect_error` clause without a template string `bad_input`\n", {});
                return false;
            } else {
                var input = as_toplevel(test, test.input, test.mangle);
                if (!input) return false;
                var input_code = make_code(input, output_options);
                var input_formatted = make_code(test.input, {
                    ecma: 2015,
                    beautify: true,
                    quote_style: 3,
                    keep_quoted_props: true
                });
            }
            try {
                parse(input_code);
            } catch (ex) {
                log(test, "!!! Cannot parse input\n---INPUT---\n{input}\n--PARSE ERROR--\n{error}\n\n", {
                    input: input_formatted,
                    error: ex,
                });
                return false;
            }
            if (!test.no_mozilla_ast) {
                try {
                    var ast = input.to_mozilla_ast();
                    var mozilla_options = {
                        ecma: output_options.ecma,
                        ascii_only: output_options.ascii_only,
                        comments: false,
                    };
                    var ast_as_string = AST.AST_Node.from_mozilla_ast(ast).print_to_string(mozilla_options);
                    var input_string = input.print_to_string(mozilla_options);
                    if (input_string !== ast_as_string) {
                        log(test, "!!! Mozilla AST I/O corrupted input\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n\n", {
                            input: input_string,
                            output: ast_as_string,
                        });
                        return false;
                    }
                } catch (moz_ast_error) {
                    log(test, "!!! Mozilla AST I/O crashed\n---INPUT---\n{input}", {
                        input: input_formatted,
                    });
                    console.error(moz_ast_error);
                    return false;
                }
            }
            var options = defaults(test.options, { });
            if (test.mangle && test.mangle.properties && test.mangle.properties.keep_quoted) {
                var quoted_props = test.mangle.properties.reserved;
                if (!Array.isArray(quoted_props)) quoted_props = [];
                test.mangle.properties.reserved = quoted_props;
                if (test.mangle.properties.keep_quoted !== "strict") {
                    reserve_quoted_keys(input, quoted_props);
                }
            }
            if (test.rename) {
                input.figure_out_scope(test.mangle);
                input.expand_names(test.mangle);
            }
            var cmp = new Compressor(options, {
                false_by_default: options.defaults === undefined ? true : !options.defaults,
                mangle_options: test.mangle
            });
            var output = cmp.compress(input);
            output.figure_out_scope(test.mangle);
            if (test.mangle) {
                output.compute_char_frequency(test.mangle);
                (function(cache) {
                    if (!cache) return;
                    if (!("props" in cache)) {
                        cache.props = new Map();
                    } else if (!(cache.props instanceof Map)) {
                        const props = new Map();
                        for (const key in cache.props) {
                            if (HOP(cache.props, key) && key.charAt(0) === "$") {
                                props.set(key.substr(1), cache.props[key]);
                            }
                        }
                        cache.props = props;
                    }
                })(test.mangle.cache);
                output.mangle_names(test.mangle);
                mangle_private_properties(output, test.mangle);
                if (test.mangle.properties) {
                    output = mangle_properties(output, test.mangle.properties);
                }
            }
            output = make_code(output, output_options);
            if (test.expect_stdout && typeof expect == "undefined") {
                // Do not verify generated `output` against `expect` or `expect_exact`.
                // Rely on the pending `expect_stdout` check below.
            } else if (expect != output && !process.env.TEST_NO_COMPARE) {
                log(test, "!!! failed\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n---EXPECTED---\n{expected}\n\n", {
                    input: input_formatted,
                    output: output,
                    expected: expect
                });
                return false;
            }
            try {
                parse(output);
            } catch (ex) {
                log(test, "!!! Test matched expected result but cannot parse output\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n--REPARSE ERROR--\n{error}\n\n", {
                    input: input_formatted,
                    output: output,
                    error: ex.stack,
                });
                return false;
            }
            if (test.expect_stdout
                && (!test.node_version || semver.satisfies(process.version, test.node_version))
                && enable_js_sandbox
            ) {
                var stdout = sandbox.run_code(input_code, test.prepend_code);
                if (test.expect_stdout === true) {
                    test.expect_stdout = stdout;
                }
                if (!sandbox.same_stdout(test.expect_stdout, stdout)) {
                    log(test, "!!! Invalid input or expected stdout\n---INPUT---\n{input}\n---EXPECTED {expected_type}---\n{expected}\n---ACTUAL {actual_type}---\n{actual}\n\n", {
                        input: input_formatted,
                        expected_type: typeof test.expect_stdout == "string" ? "STDOUT" : "ERROR",
                        expected: test.expect_stdout,
                        actual_type: typeof stdout == "string" ? "STDOUT" : "ERROR",
                        actual: stdout,
                    });
                    return false;
                }
                stdout = sandbox.run_code(output, test.prepend_code);
                if (!sandbox.same_stdout(test.expect_stdout, stdout)) {
                    log(test, "!!! failed\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n---EXPECTED {expected_type}---\n{expected}\n---ACTUAL {actual_type}---\n{actual}\n\n", {
                        input: input_formatted,
                        output: output,
                        expected_type: typeof test.expect_stdout == "string" ? "STDOUT" : "ERROR",
                        expected: test.expect_stdout,
                        actual_type: typeof stdout == "string" ? "STDOUT" : "ERROR",
                        actual: stdout,
                    });
                    return false;
                }
                if (test.reminify && !await reminify(test, input_code, input_formatted)) {
                    return false;
                }
            }
            return true;
        }
        var tests = parse_test(path.resolve(dir, file));
        let { GREP } = process.env;
        for (var i in tests) if (tests.hasOwnProperty(i)) {
            if (GREP && !i.includes(GREP)) continue;
            test_cases++;
            if (!await test_case(tests[i])) {
                test_failures++;
                failed_files[file] = 1;
                if (process.env.TEST_FAIL_FAST) return false;
            }
        }
        return true;
    }
    for (const file of files) {
        if (!await test_file(file)) {
            break;
        }
    }
    const result = { test_failures, test_cases, failed_files };
    if (!in_child_process) {
        log_test_result(result);
    }

    return result;
}

function parse_test(file) {
    var script = fs.readFileSync(file, "utf8");
    // TODO try/catch can be removed after fixing https://github.com/mishoo/UglifyJS2/issues/348
    try {
        var ast = parse(script, {
            filename: file
        });
    } catch (e) {
        console.log("Caught error while parsing tests in " + file + "\n");
        console.log(e);
        throw e;
    }
    var tests = {};
    var tw = new AST.TreeWalker(function(node, descend) {
        if (
            node instanceof AST.AST_LabeledStatement
            && tw.parent() instanceof AST.AST_Toplevel
        ) {
            var name = node.label.name;
            if (name in tests) {
                throw new Error('Duplicated test name "' + name + '" in ' + file);
            }
            tests[name] = get_one_test(file, name, node.body);
            return true;
        }
        if (node instanceof AST.AST_Directive) return true;
        if (!(node instanceof AST.AST_Toplevel)) croak(node);
    });
    ast.walk(tw);

    const only_tests = Object.entries(tests).filter(([_name, test]) => test.only);
    return only_tests.length > 0
        ? Object.fromEntries(only_tests)
        : tests;

    function croak(node) {
        throw new Error(tmpl("Can't understand test file {file} [{line},{col}]\n{code}", {
            file: file,
            line: node.start.line,
            col: node.start.col,
            code: make_code(node, { beautify: false })
        }));
    }

    function read_boolean(stat) {
        if (stat.TYPE == "SimpleStatement") {
            var body = stat.body;
            if (body instanceof AST.AST_Boolean) {
                return body.value;
            }
        }
        throw new Error("Should be boolean");
    }

    function read_string(stat) {
        if (stat.TYPE == "SimpleStatement") {
            var body = stat.body;
            switch(body.TYPE) {
              case "String":
                return body.value;
              case "Array":
                return body.elements.map(function(element) {
                    if (element.TYPE !== "String")
                        throw new Error("Should be array of strings");
                    return element.value;
                }).join("\n");
            }
        }
        throw new Error("Should be string or array of strings");
    }

    function get_one_test(file, name, block) {
        var test = {
            file: file.replace(/.+\/(test\/compress\/\w+\.js)/, "$1") + ':' + block.start.line,
            name: name,
            options: {},
            reminify: true,
            only: false
        };
        var tw = new AST.TreeWalker(function(node, descend) {
            if (node instanceof AST.AST_Assign) {
                if (!(node.left instanceof AST.AST_SymbolRef)) {
                    croak(node);
                }
                var name = node.left.name;
                test[name] = evaluate(node.right);
                return true;
            }
            if (node instanceof AST.AST_LabeledStatement) {
                var label = node.label;
                assert.ok(
                    [
                        "input",
                        "bad_input",
                        "prepend_code",
                        "expect",
                        "expect_error",
                        "expect_exact",
                        "expect_stdout",
                        "node_version",
                        "no_mozilla_ast",
                        "reminify",
                    ].includes(label.name),
                    tmpl("Unsupported label {name} [{line},{col}]", {
                        name: label.name,
                        line: label.start.line,
                        col: label.start.col
                    })
                );
                var stat = node.body;
                if (label.name == "expect_exact" || label.name == "node_version") {
                    test[label.name] = read_string(stat);
                } else if (label.name == "reminify") {
                    var value = read_boolean(stat);
                    test.reminify = value == null || value;
                } else if (label.name == "expect_stdout") {
                    var body = stat.body;
                    if (body instanceof AST.AST_Boolean) {
                        test[label.name] = body.value;
                    } else if (body instanceof AST.AST_Call) {
                        var ctor = global[body.expression.name];
                        assert.ok(ctor === Error || ctor.prototype instanceof Error, tmpl("Unsupported expect_stdout format [{line},{col}]", {
                            line: label.start.line,
                            col: label.start.col
                        }));
                        test[label.name] = ctor.apply(null, body.args.map(function(node) {
                            assert.ok(node instanceof AST.AST_Constant, tmpl("Unsupported expect_stdout format [{line},{col}]", {
                                line: label.start.line,
                                col: label.start.col
                            }));
                            return node.value;
                        }));
                    } else {
                        test[label.name] = read_string(stat) + "\n";
                    }
                } else if (label.name === "prepend_code") {
                    test[label.name] = read_string(stat);
                } else if (label.name === "no_mozilla_ast") {
                    test[label.name] = read_boolean(stat);
                } else {
                    test[label.name] = stat;
                }
                return true;
            }
        });
        block.walk(tw);
        return test;
    }
}

function make_code(ast, options) {
    var code_verbatim = as_template_string_code(ast);
    if (code_verbatim != null) return code_verbatim;
    var stream = OutputStream(options);
    ast.print(stream);
    return stream.get();
}

function evaluate(code) {
    if (code instanceof AST.AST_Node)
        code = make_code(code, { beautify: true });
    return new Function("return(" + code + ")")();
}

// Try to reminify original input with standard options
// to see if it matches expect_stdout.
async function reminify(test, input_code, input_formatted) {
    if (process.env.TEST_NO_REMINIFY) return true;
    const { options: orig_options, expect_stdout } = test;
    for (var i = 0; i < minify_options.length; i++) {
        var options = JSON.parse(minify_options[i]);
        options.keep_fnames = orig_options.keep_fnames;
        options.keep_classnames = orig_options.keep_classnames;
        if (orig_options.compress) {
            options.compress.keep_classnames = orig_options.compress.keep_classnames;
            options.compress.keep_fargs = orig_options.compress.keep_fargs;
            options.compress.keep_fnames = orig_options.compress.keep_fnames;
        }
        if (orig_options.mangle) {
            options.mangle.keep_classnames = orig_options.mangle.keep_classnames;
            options.mangle.keep_fnames = orig_options.mangle.keep_fnames;
        }
        var options_formatted = JSON.stringify(options, null, 4);
        var result = await minify(input_code, options);
        if (result.error) {
            log(test, "!!! failed input reminify\n---INPUT---\n{input}\n--ERROR---\n{error}\n\n", {
                input: input_formatted,
                error: result.error.stack,
            });
            return false;
        } else if (!process.env.TEST_NO_SANDBOX) {
            var stdout = sandbox.run_code(result.code, test.prepend_code);
            if (typeof expect_stdout != "string" && typeof stdout != "string" && expect_stdout.name == stdout.name) {
                stdout = expect_stdout;
            }
            if (!sandbox.same_stdout(expect_stdout, stdout)) {
                log(test, "!!! failed running reminified input\n---INPUT---\n{input}\n---OPTIONS---\n{options}\n---OUTPUT---\n{output}\n---EXPECTED {expected_type}---\n{expected}\n---ACTUAL {actual_type}---\n{actual}\n\n", {
                    input: input_formatted,
                    options: options_formatted,
                    output: result.code,
                    expected_type: typeof expect_stdout == "string" ? "STDOUT" : "ERROR",
                    expected: expect_stdout,
                    actual_type: typeof stdout == "string" ? "STDOUT" : "ERROR",
                    actual: stdout,
                });
                return false;
            }
        }
    }
    return true;
}
