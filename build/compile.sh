#!/bin/bash

# Compile the helper
yarn run google-closure-compiler --js=src/helper.js --js_output_file=dist/helper.js

# Rename it to helper-{hash}.js
printf 'helper-%s.js' $( cat dist/helper.js | openssl dgst -sha384 -binary | openssl base64 -A ) | xargs -I '{}' mv dist/helper.js 'dist/{}'
