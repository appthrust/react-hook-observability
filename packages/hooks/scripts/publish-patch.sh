#!/bin/bash

set -e

export version=$(npm version patch)
git add .
git commit
git tag hooks-$version
git push --tag
gh release create hooks-$version