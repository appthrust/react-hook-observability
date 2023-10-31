#!/bin/sh

PWD=$(pwd)
SHUTDOWN_COMMAND="tilt down & k3d cluster delete --config $PWD/k3d-default.yaml"

trap "$SHUTDOWN_COMMAND & echo shutdown && exit 0" INT

k3d cluster create --config $PWD/k3d-default.yaml
tilt up

echo "Cluster is running. Press Ctrl+C to shutdown."
while true; do sleep 1; done