# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](#code-of-conduct), please follow it in all your interactions
with the project. In general also try to be nice to others.

## Pull Request Process

1. When fixing a bug, include one or more tests which prove that your changes are correct, and
   that they fix something wrong. When adding a feature, include tests that show it in practice.
2. Update the README.md with details of changes to the interface, this includes new environmen
   variables, options, useful file locations and others.

## Documentation

Every new feature and API change should be accompanied by a README addition.

## Testing

All features and bugs should have tests that verify the fix. You can run all
tests using `npm test`.

There are two kinds of tests:

 * compress tests, located in `test/compress` and run with `npm run test:compress`, optionally with a test file name argument.
 * mocha-based tests, located in `test/mocha` and run with `npm run test:mocha`

To run both of these tests at once, use `npm test`.

The most common type of test are tests that verify input and output of the
compress step. These tests exist in `test/compress`. New tests can be added
either to an existing file or in a new file `issue-xxx.js`.

Tests that cannot be expressed as a simple AST can be found in `test/mocha`.

## Code style

- File encoding must be `UTF-8`.
- `LF` is always used as a line ending.
- Statements end with semicolons.
- Indentation uses 4 spaces, switch `case` 2 spaces.
- Identifiers use `snake_case`.
- Strings use double quotes (`"`).
- Use a trailing comma for multiline array and object literals to minimize diffs.
- Line length should be at most 80 cols, except when it is easier to read a
  longer line.
- Multiline conditions place `&&` and `||` first on the line.
- Code must pass the lint (`npm run lint`, or `npm run lint-fix` for auto-fix).

**Example feature**

```js
def_optimize(AST_Debugger, function(self, compressor) {
    if (compressor.option("drop_debugger"))
        return make_node(AST_EmptyStatement, self);
    return self;
});
```

**Example test case**

```js
drop_debugger: {
    options = {
        drop_debugger: true,
    }
    input: {
        debugger;
        if (foo) debugger;
    }
    expect: {
        if (foo);
    }
}
```

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [INSERT EMAIL ADDRESS]. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/)
