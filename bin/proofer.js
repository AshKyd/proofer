#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const proofer = require('../src');
const async = require('async');
const program = require('commander');
const copy = require('recursive-copy');

program
  .version(require(path.join(__dirname, '../package.json')).version)
  .option('-i, --apib [file]', 'API Blueprint input file')
  .option('-o, --output [dir]', 'Output dir [stdout]', 'stdout')
  .option('-t, --template [dir]', 'Also output HTML template in conjunction with -o [default]', 'none')
  .parse(process.argv);

if (!program.apib) {
  console.error('apib must be supplied with --apib');
  process.exit();
}

async.waterfall([
  // parse the apib
  function parser(done) {
    const markdown = fs.readFileSync(path.resolve(process.cwd(), program.apib), 'utf8');
    proofer.parse(markdown, (error, result) => done(error, JSON.stringify(result)));
  },

  // Write to the output folder (or stdout)
  function outputFolder(json, done) {
    if (program.output === 'stdout') {
      console.log(json);
      process.exit();
    }

    // Load the specified template or the default template
    let inputDir;
    if (program.template === 'default') {
      inputDir = path.join(__dirname, '../client');
    } else if (program.template !== 'none') {
      inputDir = path.resolve(process.cwd(), program.template);
    }

    const outputDir = path.resolve(process.cwd(), program.output);

    // Make the output dir if it doesn't exist
    if (!fs.statSync(outputDir)) fs.mkdirSync(outputDir);

    // Write the JSON output
    fs.writeFileSync(path.join(outputDir, 'output.json'), json);

    if (inputDir) {
      copy(inputDir, outputDir, done);
    }
  },
]);
