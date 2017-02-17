#!/usr/bin/env node
const program = require('commander');
const proofer = require('../src');

program
  .version(require('../package.json').version)
  .option('-i, --apib [file]', 'API Blueprint input file')
  .option('-o, --output [dir]', 'Output dir [stdout]', 'stdout')
  .option('-t, --template [dir]', 'Also output HTML template in conjunction with -o [default]', 'none')
  .parse(process.argv);

if (!program.apib) {
  program.outputHelp();
  process.exit();
}

proofer(program.apib, program.output, program.template);
