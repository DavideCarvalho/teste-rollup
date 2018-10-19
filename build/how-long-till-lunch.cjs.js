'use strict';

var hybrids = require('hybrids');

const MyComponent = {
  render: () => hybrids.html`
    <h1>Hello World</h1>
  `, 
};

hybrids.define('my-component', MyComponent);
