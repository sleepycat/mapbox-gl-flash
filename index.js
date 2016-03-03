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

  options: {
    position: 'top-left'
  },

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

    document.addEventListener('mapbox.setflash', function(e){
      //TODO: look into the performance of this.
      // that's probably a lot of repainting.
      if(Number.isSafeInteger(e.detail.fadeout)){
        clearTimeout(message)
	message.style.transitionProperty = ''
	message.style.opacity = 1;

        setTimeout(function(){
	  message.style.transitionDuration = e.detail.fadeout + 's'
	  message.style.transitionProperty = 'opacity'
	  message.style.opacity = 0
        }, 1000)
      } else {
	message.classList.remove(flash.options.fadeoutClass)
      }
      message.textContent = e.detail.message
      if(e.detail.info){
	message.classList.add('info')
	message.classList.remove('warn')
	message.classList.remove('error')
      }
      if(e.detail.warn){
	message.classList.add('warn')
	message.classList.remove('info')
	message.classList.remove('error')
      }
      if(e.detail.error){
	message.classList.add('error')
	message.classList.remove('info')
	message.classList.remove('warn')
      }
    })

    el.appendChild(message);

    this.container.appendChild(el);

    // Override the control being added to control containers
    if (this.options.container) this.options.position = false;

    return el;
  }

});

if (window.mapboxgl) {
  mapboxgl.Flash = Flash;
} else if (typeof module !== 'undefined') {
  module.exports = Flash;
}
