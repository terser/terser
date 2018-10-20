var fs = require("fs");
var istanbul = require("istanbul");

var UglifyJS = exports;
var FILES = UglifyJS.FILES = [
    "../lib/utils.js",
    "../lib/ast.js",
    "../lib/parse.js",
    "../lib/transform.js",
    "../lib/scope.js",
    "../lib/output.js",
    "../lib/compress.js",
    "../lib/sourcemap.js",
    "../lib/mozilla-ast.js",
    "../lib/propmangle.js",
    "../lib/minify.js",
    "./exports.js",
].map(function(file){
    return require.resolve(file);
});

var instrumenter = new istanbul.Instrumenter();

new Function("MOZ_SourceMap", "exports", function() {
    var code = FILES.map(function(file) {
        var contents = fs.readFileSync(file, "utf8");
        if (global.__IS_TESTING__) return instrumenter.instrumentSync(contents, file);
        return contents;
    });
    return code.join("\n\n");
}())(
    require("source-map"),
    UglifyJS
);

function infer_options(options) {
    var result = UglifyJS.minify("", options);
    return result.error && result.error.defs;
}

UglifyJS.default_options = function() {
    var defs = {};
    Object.keys(infer_options({ 0: 0 })).forEach(function(component) {
        var options = {};
        options[component] = { 0: 0 };
        if (options = infer_options(options)) {
            defs[component] = options;
        }
    });
    return defs;
};
