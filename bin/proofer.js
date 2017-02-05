#!/usr/bin/env node

const fs = require('fs');
const proofer = require('../src');

const markdown = fs.readFileSync(process.argv[process.argv.length - 1], 'utf8');

proofer.parse(markdown, (error, result) => {
  if (error) throw error;
  console.log(JSON.stringify(result,null,2));
})
