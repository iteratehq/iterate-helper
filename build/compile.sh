#!/bin/bash

# Replace the company variable
sed 's/{{COMPANY}}/'$1'/g' src/helper.js > tmp/$1-helper.js

# Compile the helper to dist/$1-helper.js
yarn run google-closure-compiler --js=tmp/$1-helper.js --js_output_file=dist/$1-helper.js

# Create a file with the has of dist/$1-helper.js dist/$1-helper-hash.js
cat dist/$1-helper.js | openssl dgst -sha384 -binary | openssl base64 -A > dist/$1-helper-hash.txt