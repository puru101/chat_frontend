const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/socket-frontend/runtime.js',
    './dist/socket-frontend/polyfills.js',
    './dist/socket-frontend/scripts.js',
    './dist/socket-frontend/main.js'
  ];

  await fs.ensureDir('elements');
  await concat(files, 'elements/chat-element.js');
})();