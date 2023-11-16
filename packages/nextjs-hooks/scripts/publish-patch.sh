#!/bin/bash

set -e

export version=$(npm version patch)
git add .
git commit
git tag $version
git push --tag
gh release create $version