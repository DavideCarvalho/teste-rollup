import { html, define } from 'hybrids';

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
    return html(_templateObject());
  }
};
define('my-component', MyComponent);
