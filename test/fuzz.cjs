#! /usr/bin/env node
/* eslint-env node */

var acorn = require("acorn");
var generateRandomJS = require("eslump").generateRandomJS;
var minify = require("..").minify;

var known_terser_errors = new RegExp([
  "Cannot negate a statement",
  "Cannot read property 'references' of undefined",
  "Cannot read property 'value' of undefined",
  "Octal escape sequences are not allowed in template strings",
  "Parameter .* was used already",
  "redeclared",
  "argname.definition is not a function",
  "Unexpected token: template_substitution",
  "Unexpected yield identifier inside strict mode",
].join("|"));

var known_acorn_errors = new RegExp([
  "Argument name clash",
  "Comma is not permitted after the rest element",
  "Duplicate export",
  "Expecting Unicode escape sequence",
  "Export '.*' is not defined",
  "Identifier '.*' has already been declared",
  "Invalid regular expression: ",
  "Octal literal in strict mode",
  "Unexpected token",
  "Unterminated regular expression",
].join("|"));

while (true) {
  var input = generateRandomJS();

  try {
    acorn.parse(input, {
      sourceType: "module",
    });
  } catch (e) {
    if (!known_acorn_errors.test(e.message)) {
      var result = minify(input);

      if (!result.error) {
        console.log(input);
        throw e;
      }
    }
    continue;
  }

  var result = minify(input);

  if (result.error && !known_terser_errors.test(result.error.message)) {
    console.log(input);
    throw result.error;
  }
}
