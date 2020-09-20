#!/bin/bash

set -u

git log --pretty="%an" -1 | grep "dependabot-preview[bot]" > /dev/null

if [ "$?" -eq 1 ]; then
  eval "$*"
fi

