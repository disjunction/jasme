#!/usr/bin/env node
"use strict";

var path = require("path"),
    Jasmine = require("jasmine/lib/jasmine.js"),
    fs = require("fs");

// parse commandline params
// no getopt to reduce dependencies
var outputPath = false;
var bootScript;
var options = {
    color: true
};
var specs = [];

if (process.env.JASMINE_OUTPUT) {
    outputPath = process.env.JASMINE_OUTPUT;
}

// first 2 options are "node" and this script
for (var i = 2; i < process.argv.length; i++) {
    var option = process.argv[i],
        match;
    
    if (option == "--noColor") {
        options.color = false;
        continue;
    }

    match = option.match(/^--output=(.*)$/);
    if (match) {
        outputPath = match[1];
        continue;
    }

    match = option.match(/^--boot=(.*)$/);
    if (match) {
        bootScript = match[1];
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

var jasmine = new Jasmine({ projectBaseDir: path.resolve() });

// hack - remove dot-reporter
jasmine.configureDefaultReporter({print: function() {} });

// add console reporter with colors
var SpecReporter = require("jasmine-spec-reporter");
var specReporterOptions = {
    displayStacktrace: "summary"
};
if (!options.color) {
    specReporterOptions.colors = false;
}

jasmine.addReporter(new SpecReporter(specReporterOptions));

// add junit reporter, e.g. for jenkins
if (outputPath) {
    var JUnitReporter = require("jasmine-reporters").JUnitXmlReporter,
        jUnitReporter = new JUnitReporter({
            savePath: outputPath,
            consolidateAll: true
        });
    jasmine.addReporter(jUnitReporter);
}

if (bootScript) {
    require(bootScript)(jasmine);
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
            var candidates = ["test", "tests", "spec", "specs", "test/spec"];

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
