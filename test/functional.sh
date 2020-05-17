#!/bin/bash

set -exuo pipefail

workdir=$(pwd)
# for tests that need terser-under-test path and @terser/require-terser
export TERSER_PATH="$workdir"

# build terser
npm run build -- --configTest

# grab the functional tests
mkdir -p terser-functional-tests
cd terser-functional-tests
git checkout . || true
git clone https://github.com/terser/terser-functional-tests --depth 1 . || true
git pull

# install packages and link terser in (can't npm link .., it crashes)
npm ci
(cd node_modules && rm -rf terser && ln -s ../.. terser)

npm t
