const Environment = require('jest-environment-node');

// const fetch = require('isomorphic-fetch');
/**
 * A custom environment to set the TextEncoder that is required by Textile js.
 * add --env=./jest-env.js to jest call in package.json script
 */
module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    // this.global.fetch = fetch;
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
  ENV_CHECK: 'working',
  TEST_ENV: 'unit',
  HOST: 'localhost',
  PORT_API_HTTP: 8081,
  APP_SECRET: 'jest-secret',
};
