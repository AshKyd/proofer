const fs = require('fs');
const path = require('path');
const proofer = require('./parse');
const async = require('async');
const copy = require('recursive-copy');

module.exports = function index(apib, output, template) {
  async.waterfall([
    // parse the apib
    function parser(done) {
      const markdown = fs.readFileSync(path.resolve(process.cwd(), apib), 'utf8');
      proofer.parse(markdown, (error, result) => done(error, JSON.stringify(result)));
    },

    // Write to the output folder (or stdout)
    function outputFolder(json, done) {
      if (output === 'stdout') {
        console.log(json);
        process.exit();
      }

      // Load the specified template or the default template
      let inputDir;
      if (template === 'default') {
        inputDir = path.join(__dirname, '../client');
      } else if (template !== 'none') {
        inputDir = path.resolve(process.cwd(), template);
      }

      const outputDir = path.resolve(process.cwd(), output);

      // Make the output dir if it doesn't exist
      try {
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
      } catch (e) {
        console.error(`Could not create directory ${outputDir}`);
        process.exit();
      }

      if (inputDir) {
        copy(inputDir, outputDir, { overwrite: true }, done);
      }

      // Write the JSON output
      fs.writeFileSync(path.join(outputDir, 'data.json'), json);
    },
  ]);
}
