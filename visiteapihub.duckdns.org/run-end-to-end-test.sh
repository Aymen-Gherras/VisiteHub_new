#!/bin/bash

echo "========================================"
echo "  End-to-End Cloudinary Test Runner"
echo "========================================"
echo

echo "Checking dependencies..."
if npm list form-data >/dev/null 2>&1; then
    echo "form-data is already installed"
else
    echo "Installing form-data dependency..."
    npm install form-data
    if [ $? -ne 0 ]; then
        echo "Failed to install form-data"
        exit 1
    fi
fi

echo
echo "Running end-to-end test..."
echo

node test-end-to-end.js

echo
echo "Test completed."
