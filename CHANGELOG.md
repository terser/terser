# Changelog

## v3.16.1

 - Fixed issue where Terser being imported with `import` would cause it not to work due to the `__esModule` property.

## v3.16.0

 - No longer leaves names like Array or Object or window as a SimpleStatement (statement which is just a single expression).
 - Add support for sections sourcemaps (IndexedSourceMapConsumer)
 - Drops node.js v4 and starts using commonJS
 - Is now built with rollup

## v3.15.0

 - Inlined spread syntax (`[...[1, 2, 3], 4, 5] => [1, 2, 3, 4, 5]`) in arrays and objects.
 - Fixed typo in compressor warning
 - Fixed inline source map input bug
 - Fixed parsing of template literals with unnecessary escapes (Like `\\a`)
