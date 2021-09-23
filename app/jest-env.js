const Environment = require('jest-environment-jsdom');

/**
 * A custom environment to set the TextEncoder that is required by Textile js.
 * add --env=./jest-env.js to jest call in package.json script
 */
module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util');
      this.global.TextDecoder = TextDecoder;
    }
  }
};
process.env = {
  TEST_ENV: 'unit',
  NODE_ENV: 'test',
};