import "./lib/transform.js";
import "./lib/mozilla-ast.js";
import { minify } from "./lib/minify.js";

export { minify, minify_sync } from "./lib/minify.js";
export { run_cli as _run_cli } from "./lib/cli.js";

export async function _default_options() {
    const defs = {};

    const base = await infer_options({ 0: 0 });
    for (const component of Object.keys(base)) {
        const options = await infer_options({
            [component]: {0: 0}
        });

        if (options) defs[component] = options;
    }
    return defs;
}

async function infer_options(options) {
    try {
        await minify("", options);
    } catch (error) {
        return error.defs;
    }
}
