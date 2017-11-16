'use strict';

var test = require('tape');
var request = require('supertest');
var app = require('../app');

test('Normalize.css is correctly served from the node_modules folder', function (t) {
  request(app)
    .get('/node_modules/normalize.css/normalize.css')
    .expect('Content-Type', /css/)
    .expect(200)
    .end(t.end);
});

test('Milligram is correctly served from the node_modules folder', function (t) {
  request(app)
    .get('/node_modules/milligram/dist/milligram.min.css')
    .expect('Content-Type', /css/)
    .expect(200)
    .end(t.end);
});

test('FontAwesome is correctly served from the node_modules folder', function (t) {
  request(app)
    .get('/node_modules/font-awesome/css/font-awesome.min.css')
    .expect('Content-Type', /css/)
    .expect(200)
    .end(t.end);
});

test('GET users', function (t) {
  request(app)
    .get('/users')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end);
});
