[![build status](https://api.travis-ci.org/disjunction/jasme.png)](https://travis-ci.org/disjunction/jasme)

# Jasme

simplistic node.js **jasmine 3.1.x launcher**, created to compensate the lack of jasmine 3 support in jamine-node

## Features

 * you don't have to specify or create jasmine config file (you still can though)
 * you can specify files or glob patterns as command line parameters
 * nice console reporter included by default (jasmine-spec-reporter)
 * you can export results as JUnit xml
 * if no paths is provided, then it tries to autodetect your spec dir

## Usage

**Option a**: install globally (`-g`):

```sh
npm install -g jasme

jasme [--output=junit_xml_dir] [--noColor] [--boot=boot_script] [spec_mask...]
```

**Option b**: install for specific project:

```sh
npm install --save-dev jasme

node node_modules/jasme/run.js ...
# ... or for *nix ppl simply ...
node_modules/jasme/run.js ...
```

## Options

* **noColor** - disables ANSI color output
* **output=...** - generates junit xml output
* **boot=...** - runs a bootstrap script, where you can add helpers etc.

## Examples

```sh
# Run all `*.js` files in given dir:
jasme tests/my_specs

# run only specific files using glob syntax (note the quotes!):
jasme 'tests/feature_a/**/*.*Spec.js' 'tests/feature_b/*Spec.js'

# run specs in a default dir and export result to "target" dir
jasme --output=target tests

# let jasme find my tests (in either "spec", "specs", "test" or "tests" dirs)
jasme

```
