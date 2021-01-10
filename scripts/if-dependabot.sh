#!/bin/bash

set -u

git log --pretty="%an" -1 | grep "dependabot-preview[bot]" > /dev/null

if [ "$?" -eq 0 ]; then
  eval "$*"
fi

