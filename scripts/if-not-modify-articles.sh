#!/bin/bash

set -u

git diff --name-only master | grep "content/articles" > /dev/null

if [ "$?" -eq 1 ]; then
  eval "$*"
fi

