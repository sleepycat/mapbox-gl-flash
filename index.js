'use strict';
/* global mapboxgl */

var mapboxgl = require('mapbox-gl')

// Polyfill some useful functions and drop some
// dependencies.
//
// Number.isSafeInteger
Number.isSafeInteger = Number.isSafeInteger || function(num) {
  return typeof num === 'number' &&
    isFinite(num) &&
      Math.floor(num) === num &&
	Math.abs( num ) <= Number.MAX_SAFE_INTEGER;
};

// Object.assign

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/**
 * A flash component for Mapbox GL
 * @class mapboxgl.Flash
 *
 * @example
 * var flash = new mapboxgl.Flash();
 * map.addControl(flash);
 * @return {Flash} `this`
 */
function Flash(options) {
  this.options = Object.assign({}, this.options, options);
  return this
}

Flash.prototype = mapboxgl.util.inherit(mapboxgl.Control, {

  options: {},

  onAdd: function(map) {
    var flash = this;
    this.container = this.options.container ?
      typeof this.options.container === 'string' ?
      document.getElementById(this.options.container) :
      this.options.container :
      map.getCanvasContainer();

    // Template
    var el = document.createElement('div');
    el.id = 'mapboxgl-ctrl-flash';
    if(!(flash.options.container)){
      el.style.width = map.getCanvas().width + 'px';
      el.style.margin = '0';
    }

    var message = document.createElement('p');
    message.className = 'flash-message';
    message.style.display = 'none'

    document.addEventListener('mapbox.setflash', function(e){
      // TODO: break this into smaller functions
      if(e.detail.message === ''){
        message.style.display = 'none'

      } else {
        // set the message
        message.textContent = e.detail.message
        message.style.display = 'block'
        // In case it's been called with a class previously
        message.classList.remove('warn', 'info', 'error')
        if(Number.isSafeInteger(e.detail.fadeout)){
          clearTimeout(message)
          message.style.transitionDuration = '0.5s'
          message.style.opacity = 1;

          setTimeout(function(){
            message.style.transitionDuration = e.detail.fadeout + 's'
            message.style.transitionProperty = 'opacity'
            message.style.opacity = 0
          }, 1000)
        } else {
          // In case it's been called with fadeout previously
          message.style.transitionDuration = '0s'
          message.style.transitionProperty = 'opacity'
          message.style.opacity = 1;
        }
        if(e.detail.info){
          message.classList.add('info')
        }
        if(e.detail.warn){
          message.classList.add('warn')
        }
        if(e.detail.error){
          message.classList.add('error')
        }
      }
    })

    el.appendChild(message);

    this.container.appendChild(el);

    return el;
  }

});

if (window.mapboxgl) {
  mapboxgl.Flash = Flash;
} else if (typeof module !== 'undefined') {
  module.exports = Flash;
}
