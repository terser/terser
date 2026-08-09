#!/bin/bash

set -euo pipefail

# This is a mutation test engine. It tries to break the JS code, one branch at a time, then runs tests to make sure some test fails.

MUTATE_FILES=lib/compress
BRANCH_REGEX='if ('
TEST_COMMAND='timeout 300 npm run test 2>&1 >/dev/null'

function main() {
    git diff --exit-code || die "git diff is not clean"

    echo "creating directory mutation_test_failures"
    rm -rf mutation_test_failures
    mkdir -p mutation_test_failures

    echo "---------------------------------------"
    echo "MUTATION TESTS
    echo "---------------------------------------"
    echo "Testing files under: $MUTATE_FILES"
    echo "Test command: $TEST_COMMAND"
    echo "This will take a while."

    fail_count=0

    for file in $(find "$MUTATE_FILES" -type f | sort); do
        branch_count=$(grep --count "$BRANCH_REGEX" "$file")

        for i in $(seq 0 $((branch_count - 1))); do
            mutate_file "$file" "$i"
            git diff
            if test_codebase; then
                echo TEST SUCCESS
                echo The mutation did not make tests fail
                fail_count=$((fail_count + 1))
                git diff > mutation_test_failures/failure_$fail_count.patch
            else
                echo TEST FAIL
            fi
            git checkout "$file"
        done
    done
}

function mutate_file {
    export file_name=$1
    export nth_branch=$2
    echo Mutating the file $file_name. We will mutate the $nth_branch-th branch

    echo '
        import fs from "fs";
        import assert from "assert";
        import { parse } from "acorn";
        import { generate } from "astring";

        assert(!isNaN(+process.env.nth_branch))
        assert(process.env.file_name)

        let source = fs.readFileSync(process.env.file_name).toString();
        const ast = parse(source, { sourceType: "module", ecmaVersion: 2099 });

        let found = false

        let branch_index = +process.env.nth_branch + 1

        find_nth_branch(ast, ifStatement => {
            source = negate_if_statement(ifStatement)
            fs.writeFileSync(process.env.file_name, source)
            process.exit(0)
        })

        if (found === false) throw new Error("branch never found")

        function find_nth_branch(ast, callback) {
            if (branch_index <= 0) return

            if (ast.type === "IfStatement" && --branch_index === 0) {
                found = true
                callback(ast)

                return // top of function will return from now on
            }

            for (const [key, value] of Object.entries(ast)) {
                if (!value || typeof value !== "object") continue;

                if (Array.isArray(value)) {
                    value.forEach(ast => find_nth_branch(ast, callback));
                } else {
                    find_nth_branch(value, callback);
                }
            }
        }

        function negate_if_statement(ast) {
            const [before, test, after] = [
                source.slice(0, ast.test.start),
                source.slice(ast.test.start, ast.test.end),
                source.slice(ast.test.end, ),
            ]

            return `${before}/* MUTATION_TEST */ !(${test})${after}`
        }
    ' | node
}

function test_codebase {
    eval "$TEST_COMMAND"
}

function die() { echo $1; exit 1; }

main
