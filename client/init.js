const MarkdownIt = require('markdown-it');
Ractive.DEBUG = String(window.location).match(/localhost/);
function init(data, ractiveTemplate){
  const md = new MarkdownIt({ html: true });
  const parseHash = hash => {
    let index = hash.indexOf('+') - 1;
    if(index < 0) index = undefined;
    return hash.substr(1, index);
  };
  const slugify = data.slugify = string => String(string).toLowerCase().replace(/\s/g,'-').replace(/[^a-z0-9-]/g, '');
  const markdown = data.markdown = string => md.render(string).replace(/<table>/g, '<table class="table">');
  const isHeroSection = data.isHeroSection = content => {
    const isHero = content.element === 'copy' && content.content.length < 500;
    return isHero;
  };

  data.windowHash = parseHash(window.location.hash);
  data.categories.forEach(cat => cat.categoryHash = slugify(cat.categoryTitle));
  data.showId = {};

  var ractive = new Ractive({
    el: '#container',
    template: ractiveTemplate,
    data: data,
  });

  let editor;
  const hashchange = () => {
    if(editor) editor.destroy();
    const windowHash = parseHash(window.location.hash);
    ractive.set('windowHash', windowHash);
    if(windowHash.includes('ace-editor')){
      scrollTo(0,0);
      const keyPath = windowHash.replace(/^ace-editor-/, '');
      const content = ractive.get(keyPath)

      editor = ace.edit("editor");
      editor.setOptions({
        maxLines: Infinity
      });
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/javascript");
      document.getElementById('editor').style.fontSize='1em';
      editor.setValue(content.content, 1);
    }
  };
  window.addEventListener("hashchange", hashchange, false);
  hashchange();

  ractive.once('init', () => {
    if(window.location.hash === '#') return;
    document.querySelector(window.location.hash).scrollIntoView();
  })

  ractive.on('categorychange', () => scrollTo(0,0));
}

Promise.all([
    fetch('data.json').then(response => response.json()),
    fetch('template.ractive').then(response => response.text()),
  ])
  .then((responses) => init(responses[0], responses[1]));
