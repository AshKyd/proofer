# Proofer
A thing to render [API Blueprint](https://apiblueprint.org) documents in HTML.

> proof (noun)
> a trial impression of a page, taken from type or film and used for making corrections before final printing.

This piggy-backs off a bunch of stuff:
* Uses the [emscripten build of drafter](https://github.com/apiaryio/drafter.js) to parse apib files
* Uses [Ractive](https://ractivejs.org/) for templating
* Uses [Ace Editor](https://github.com/ajaxorg/ace) for displaying schemas & responses

## Example project
The proofer-rendered versino of the Apiary polls.apib can be found at:

http://proofer-polls-apib.surge.sh/

## Usage

### Command line
```
Usage: proofer [options]

Options:

  -h, --help            output usage information
  -V, --version         output the version number
  -i, --apib [file]     API Blueprint input file
  -o, --output [dir]    Output dir [stdout]
  -t, --template [dir]  Also output HTML template in conjunction with -o [default]
```

### Programmatic usage
You can require this in and use it programmatically like so:

```
const proofer = require('proofer');
proofer(pathToApib, outputDir, templateToUse, callback);
```

outputDir and templateToUse are optional and will return the rendered JSON as
the callback argument. Specifying both will output as per the command line app.

## Building

```
# Install & build
npm install
npm run build

# Launch the index.html in your fav browser
google-chrome bin/index.html
```
