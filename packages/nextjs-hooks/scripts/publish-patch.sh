#!/bin/bash

set -e

export version=$(npm version patch)
git add .
git commit
git tag nextjs-hooks-$version
git push --tag
gh release create nextjs-hooks-$version