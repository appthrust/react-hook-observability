#!/bin/bash

set -e

export version=$(npm version patch)
git add .
git commit
git tag nextjs-server-actions-$version
git push --tag
gh release create nextjs-server-actions-$version