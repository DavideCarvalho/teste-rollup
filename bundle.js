import { html, define } from 'hybrids';

const MyComponent = {
  render: () => html`
    <h1>Hello World</h1>
  `
};
define('my-component', MyComponent);
