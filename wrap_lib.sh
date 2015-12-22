#!/bin/bash

# Self-loading library:
# - wrap tangram source in a global variable
# - evalaute the variable to load the library
# - assign the source to tangram so it can later load itself into a web worker
# - remove the global variable

SOURCE=$(cat)

echo 'window._TangramSource = ';
echo "$SOURCE" | node_modules/.bin/jsesc --wrap --single-quotes
echo ';'
echo 'eval(window._TangramSource);';
echo 'Tangram._source = window._TangramSource;';
echo 'delete window._TangramSource;';
