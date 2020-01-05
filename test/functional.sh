#!/bin/bash

set -exo pipefail

npm run build
mkdir -p terser-functional-tests
cd terser-functional-tests
git checkout . || true
git clone https://github.com/terser/terser-functional-tests --depth 1 . || true
git pull
npm ci
npm link ..
TERSER_PATH="$(pwd)/.." ./run-all.sh
