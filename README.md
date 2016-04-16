[![build status](https://api.travis-ci.org/disjunction/jasme.png)](https://travis-ci.org/disjunction/jasme)

# Jasme

simplistic node.js **jasmine 2.4.x launcher**, created to compensate the lack of jasmine 2 support in jamine-node

## Features

 * you don't have to specify or create jasmine config file (you still can though)
 * you can specify files or glob patterns as command line parameters
 * nice console reporter included by default (jasmine-spec-reporter)
 * you can export results as JUnit xml
 * if no paths is provided, then it tries to autodetect your spec dir

## Usage

**Option a**: install globally (`-g`):

`jasme [--output=junit_xml_dir] [spec_mask...]`

**Option b**: install for specific project:

```
npm install --save-dev jasme

node node_modules/jasme/run.js ...
# ... or for *nix ppl simply ...
node_modules/jasme/run.js ...
```

## Examples

```
# Run all `*.js` files in given dir:
jasme tests/my_specs

# run only specific files using glob syntax (note the quotes!):
jasme 'tests/feature_a/**/*.*Spec.js' 'tests/feature_b/*Spec.js'

# run specs in a default dir and export result to "target" dir
jasme --output=target tests

# let jasme find my tests (in either "spec", "specs", "test" or "tests" dirs)
jasme

```
