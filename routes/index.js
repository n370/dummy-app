var path = require('path');
var express = require('express');

var router = express.Router();
var packagejson = require(path.join(process.cwd(), 'package.json'));

/* GET home page. */
router.get('/', function(req, res) {
  'use strict';
  res.render('index', {
    title: 'Dummy app',
    version: packagejson.version,
    categories: [
      {
        icon: 'fa-puzzle-piece',
        title: 'Sector',
        name: 'Sports'
      },
      {
        icon: 'fa-futbol-o',
        title: 'Sport Type',
        name: 'Bicycles'
      },
      {
        icon: 'fa-bicycle',
        title: 'Mode',
        name: 'Mountain Cross'
      }
    ]
  });
});

module.exports = router;
