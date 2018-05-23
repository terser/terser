var UglifyJS = require("..");
var ok = require("assert");

module.exports = function () {
    console.log("--- Sourcemaps tests");

    var basic = source_map([
        'var x = 1 + 1;'
    ].join('\n'));

    ok.equal(basic.version, 3);
    ok.deepEqual(basic.names, ['x']);

    var issue836 = source_map([
        "({",
        "    get enabled() {",
        "        return 3;",
        "    },",
        "    set enabled(x) {",
        "        ;",
        "    }",
        "});",
    ].join("\n"));

    ok.deepEqual(issue836.names, ['enabled', 'x']);

    // Test inline source maps with unicode characters
    var with_inline_map = UglifyJS.minify([
        "var tëst = '→unicøde←';",
        "alert(tëst);",
    ].join("\n"), {
        sourceMap: { url: 'inline', includeSources: true }
    }).code;
    var unicode_result = UglifyJS.minify(with_inline_map, {
        sourceMap: { content: 'inline', includeSources: true }
    });
    ok.ifError(unicode_result.error);
    var unicode_map = JSON.parse(unicode_result.map);

    ok.deepEqual(unicode_map.names, ['tëst', 'alert']);
}

function source_map(js) {
    return JSON.parse(UglifyJS.minify(js, {
        compress: false,
        mangle: false,
        sourceMap: true
    }).map);
}

// Run standalone
if (module.parent === null) {
    module.exports();
}

