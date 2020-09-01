#!/bin/sh

set -eux

git fetch --prune upstream

git merge --no-commit --no-ff upstream/master || true

git cat-file blob remotes/upstream/master:README.md \
    | awk -F '[| ]' '/^\|\s*[A-Za-z0-9]+\s*\|/ { print $3; }' \
    | ./upgrade.js

./generate.js
