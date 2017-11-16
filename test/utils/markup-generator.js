'use strict';

var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var templateFilename = path.join(__dirname, '..', '..', 'views', 'index.ejs');
var template = fs.readFileSync(
  templateFilename,
  {
    encoding: 'utf8'
  }
);

module.exports = ejs.render(
  template,
  {
    title: 'Dummy app',
    version: '1.0.0',
    categories: [
      {
        icon: 'fa-puzzle-piece',
        title: 'Sector',
        name: 'Sports'
      }
    ]
  },
  {
    filename: templateFilename,
    root: path.join(__dirname, '..', '..', 'views')
  }
);
