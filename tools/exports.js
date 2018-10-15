exports["Dictionary"] = Dictionary;
exports["minify"] = minify;
exports["parse"] = parse;
exports["push_uniq"] = push_uniq;
exports["TreeTransformer"] = TreeTransformer;
exports["TreeWalker"] = TreeWalker;
exports["FILES"] = [
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
];

if (typeof require !== "undefined") {
    exports["FILES"] = exports["FILES"].map(function(file) {
        return require.resolve(file);
    });
}

