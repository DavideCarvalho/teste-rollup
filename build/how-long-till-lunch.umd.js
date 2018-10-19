(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('hybrids')) :
  typeof define === 'function' && define.amd ? define(['hybrids'], factory) :
  (factory(global.hybrids));
}(this, (function (hybrids) { 'use strict';

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["\n    <h1>Hello World</h1>\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }
  var MyComponent = {
    render: function render() {
      return hybrids.html(_templateObject());
    }
  };
  hybrids.define('my-component', MyComponent);

})));
