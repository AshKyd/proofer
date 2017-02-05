# Proofer
A thing to render [API Blueprint](https://apiblueprint.org) documents in HTML.

> proof (noun)
> a trial impression of a page, taken from type or film and used for making corrections before final printing.

This piggy-backs off a bunch of stuff:
* Uses the [emscripten build of drafter](https://github.com/apiaryio/drafter.js) to parse apib files
* Uses [Ractive](https://ractivejs.org/) for templating
* Uses [Ace Editor](https://github.com/ajaxorg/ace) for displaying schemas & responses

# Example project
The proofer-rendered versino of the Apiary polls.apib can be found at:

http://proofer-polls-apib.surge.sh/

## Why would I use this?

Right now, you probably shouldn't. This is more of a proof of concept to:

1. Prove a fully Javascript-based renderer can run without compiled dependencies
2. Rapidly prototype different ways of presenting a Blueprint doc

With time I would like to decouple the build stuff and make this a proper,
extendable thing.

## Building

```
# Install & build
npm install
npm run build

# Launch the index.html in your fav browser
google-chrome bin/index.html
```
