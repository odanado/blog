#!/bin/bash

set -eu

yarn http-server --silent dist &
HTTP_SERVER_PID=$!

trap 'echo kill $HTTP_SERVER_PID; kill $HTTP_SERVER_PID' EXIT

npx acot run
