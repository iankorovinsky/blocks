#!/bin/bash

echo "Deleting everything in target/dev"

# 1. Delete everything in target/dev
rm -rf target/dev/*

echo "Asserting deletion succeeded"

# 2. Assert directory is empty
if [ "$(ls -A target/dev 2>/dev/null)" ]; then
    echo "Error: target/dev is not empty"
    exit 1
fi

echo "Moving into directory"

echo "Current directory: $(pwd)\nBuilding contract"

# 3. Run scarb build and capture output
BUILD_OUTPUT=$(scarb build 2>&1)
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "BUILD_ERROR:$BUILD_OUTPUT"
    exit 1
fi