'use strict';

var test = require('tape');
var spy = require('spy');
var JSDOM = require('jsdom').JSDOM;
var MARKUP = require('./utils/markup-generator');
var Dummy = require('../public/javascripts/script');

test('Dummy Accordion initalize prototype method', function (t) {
  var window = new JSDOM(MARKUP).window;
  var dummy = new Dummy(window);
  var state = {active: false};
  dummy.accordion.root.addEventListener = spy();
  dummy.accordion.update = spy(dummy.accordion.update);
  dummy.accordion.close = spy();
  dummy.accordion.open = spy();
  dummy.accordion.initialize(state);
  t.plan(2);
  t.ok(dummy.accordion.update.calls[0].calledWith(state), 'should set initial inner state');
  t.ok(dummy.accordion.root.addEventListener.calls[0].calledWith('click'), 'should add a click event listener to it\'s root element');
});

test('Dummy Accordion update prototype method', function (t) {
  var window = new JSDOM(MARKUP).window;
  var dummy = new Dummy(window);
  var state = {active: false};
  dummy.accordion.update = spy(dummy.accordion.update);
  dummy.accordion.close = spy();
  dummy.accordion.open = spy();
  dummy.accordion.initialize(state);
  t.plan(3);
  t.notOk(state.active, 'when called with a state object which has an active property set false');
  t.ok(dummy.accordion.close.called, 'should call Accordion.prototype.close');
  t.notOk(dummy.accordion.open.called, 'shouldn\'t call Accordion.prototype.open');
});

test('Dummy Accordion click prototype method', function (t) {
  var window = new JSDOM(MARKUP).window;
  var dummy = new Dummy(window);
  var state = {active: false};
  var initialactiveValue = state.active;
  var event = {target: dummy.accordion.header};
  dummy.accordion.state = state;
  dummy.accordion.update = spy();
  dummy.accordion.click(event);
  t.plan(3);
  t.equals(
    initialactiveValue,
    false,
    'if the Accordion instance state object has an active property set to false'
  );
  t.equals(
    event.target,
    dummy.accordion.header,
    'and is called with an event object which target property is the instance\'s accordion.header'
  );
  t.ok(
    dummy.accordion.update.calls[0].calledWith({active: !initialactiveValue}),
    'it should call the update prototype method with a state object having it\'s active property set to true'
  );
});
