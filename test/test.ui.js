'use strict';

var once = require('lodash.once');
var test = require('tape');

var dispatchEvent = function(eventName, data){
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, true, false, data);
  document.dispatchEvent(event);
};

test('Flash#message', function(tt) {
  var container, map, flash;

  function setup(opts) {
    container = document.createElement('div');
    map = new mapboxgl.Map({ container: container });
    flash = new mapboxgl.Flash(opts);
    map.addControl(flash);
  }

  tt.test('can set the text of the flash message', function(t) {
    setup();
    dispatchEvent('mapbox.setflash', {message: "foo"})
    var flashEl = container.querySelector('.flash-message');
    t.equal(flashEl.textContent, 'foo');
    t.end()
  });

  tt.test('can add an info class to the flash message', function(t) {
    setup();
    dispatchEvent('mapbox.setflash', {message: "foo", info: true})
    var flashEl = container.querySelector('.flash-message');
    t.equal(flashEl.classList.contains('info'), true);
    t.end()
  });

  tt.test('can add a warn class to the flash message', function(t) {
    setup();
    dispatchEvent('mapbox.setflash', {message: "foo", warn: true})
    var flashEl = container.querySelector('.flash-message');
    t.equal(flashEl.classList.contains('warn'), true);
    t.end()
  });

  tt.test('can add a error class to the flash message', function(t) {
    setup();
    dispatchEvent('mapbox.setflash', {message: "foo", error: true})
    var flashEl = container.querySelector('.flash-message');
    t.equal(flashEl.classList.contains('error'), true);
    t.end()
  });

  //TODO: add tests for the fadeout.

  tt.end();
});
