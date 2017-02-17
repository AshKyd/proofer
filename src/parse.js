/**
 * Proofer
 * The purpose of this file is to parse the output of Drafter into a more
 * templateable format. It's possible to directly render a drafter output
 * but this way there's less complexity in the template.
 */
const drafter = require('drafter.js');
const dotty = require('dotty');
const fs = require('fs');

let i = 0;

function parse(content) {
  const parser = parsers[content.element];
  if (parser) return parser(content);
  return { type: 'unparseable', element: content.element };
}

const parsers = {
  copy: res => ({
    id: i += 1,
    element: 'copy',
    content: res.content,
  }),
  category: res => ({
    id: i += 1,
    element: 'category',
    categoryTitle: res.meta.title,
    content: res.content.map(parse),
  }),
  resource: res => ({
    id: i += 1,
    element: 'resource',
    title: res.meta.title,
    href: res.attributes.href,
    content: res.content.map(parse),
  }),
  transition: res => ({
    id: i += 1,
    element: 'transition',
    title: res.meta.title,
    content: res.content.map(parse),
  }),
  httpTransaction: res => ({
    id: i += 1,
    element: 'httpTransaction',
    content: res.content.map(parse),
  }),
  httpRequest: res => ({
    id: i += 1,
    element: 'httpRequest',
    method: res.attributes.method,
    content: res.content.map(parse),
  }),
  httpResponse: res => ({
    id: i += 1,
    element: 'httpResponse',
    statusCode: dotty.get(res, 'attributes.statusCode'),
    headers: (dotty.get(res, 'attributes.headers.content') || []).map(parse),
    content: res.content.map(parse),
  }),
  member: (res) => {
    const payload = {
      id: i += 1,
      description: dotty.get(res, 'meta.description'),
      required: [dotty.get(res, 'attributes.typeAttributes') || []].includes('required'),
      key: res.content.key.content,
      type: res.content.value.element,
    };
    const value = res.content.value.content;
    if (typeof value === 'object') {
      payload.content = value.map(parse);
    } else {
      payload.value = value;
    }

    return payload;
  },
  asset: (res) => {
    const payload = {
      id: i += 1,
      element: 'asset',
      contentType: dotty.get(res, 'attributes.contentType'),
      content: res.content,
    };

    try {
      payload.content = JSON.stringify(JSON.parse(payload.content), null, 2);
    } catch (e) {
      // can't parse, just display whatever we can
    }

    return payload;
  },
  hrefVariables: res => ({
    id: i += 1,
    element: 'hrefVariables',
    content: res.content.map(parse),
  }),
  dataStructure: res => ({
    id: i += 1,
    element: 'dataStructure',
    content: (dotty.get(res, 'content.0.content') || []).map(parse),
  }),
};

module.exports = {
  parse(markdown, callback) {
    drafter.parse(markdown, {}, (error, res) => {
      const content = {};
      res.content.forEach((toplevel) => {
        if (toplevel.element === 'category') {
          content.meta = { title: toplevel.meta.title };
          content.categories = toplevel.content.map(parse);
        }
      });
      callback(null, content);
    });
  },
};
