#!/usr/bin/env node
"use strict";

let path = require("path"),
    Jasmine = require("jasmine/lib/jasmine.js"),
    fs = require("fs");

// parse commandline params
// no getopt to reduce dependencies
let outputPath = false,
    specs = [];

if (process.env.JASMINE_OUTPUT) {
    outputPath = process.env.JASMINE_OUTPUT;
}

// first 2 options are "node" and this script
for (let i = 2; i < process.argv.length; i++) {
    let option = process.argv[i],
        match;
    
    match = option.match(/^--output=(.*)$/);
    if (match) {
        outputPath = match[1];
        continue;
    }

    try {
        if (fs.statSync(option).isDirectory()) {
            option = option.replace(/\/+$/, "") + "/**/*.js";
        }
    } catch (e) {
        // do nothing
    }

    specs.push(option);
}

let jasmine = new Jasmine({ projectBaseDir: path.resolve() });

// hack - remove dot-reporter
jasmine.configureDefaultReporter({print: () => {} });

// add console reporter with colors
let SpecReporter = require("jasmine-spec-reporter"),
    specReporter = new SpecReporter({
        displayStacktrace: "summary"
    });
jasmine.addReporter(specReporter);

// add junit reporter, e.g. for jenkins
if (outputPath) {
    let JUnitReporter = require("jasmine-reporters").JUnitXmlReporter,
        jUnitReporter = new JUnitReporter({
            savePath: outputPath,
            consolidateAll: true
        });
    jasmine.addReporter(jUnitReporter);
}

// load config, or fall back to default
function tryLoad(configPath) {
    try {
        if (fs.statSync(configPath).isFile()) {
            jasmine.loadConfigFile(configPath);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

if (process.env.JASMINE_CONFIG_PATH) {
    jasmine.loadConfigFile(process.env.JASMINE_CONFIG_PATH);
} else {
    // try to autodetect jasmine.json config
    
    if (! (tryLoad("test/jasmine.json") || tryLoad("spec/jasmine.json"))) {

        // try to autodetect specs only if no specs were given
        if (!specs.length) {
            let candidates = ["test", "tests", "spec", "specs", "test/spec"];

            do try {
                var specPath = candidates.pop();
                if (fs.statSync(specPath).isDirectory()) {
                    jasmine.loadConfig({
                        "spec_dir": specPath,
                        "spec_files": [
                            "**/*.js"
                        ]
                    });

                    break;
                }
            } catch(e) {
                // do nothing
            } while(candidates.length);
        }
    }
}

jasmine.execute(specs);
