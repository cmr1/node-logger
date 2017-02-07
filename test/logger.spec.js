'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Logger = require('../');

describe('Logger', function() {
  let testLogger = null;
  const testConfig = {
    "log": {
      "stamp": true,
      "prefix": "",
      "color": "white"
    },
    "warn": {
      "stamp": true,
      "throws": false,
      "prefix": "WARN:",
      "color": "yellow"
    },
    "error": {
      "stamp": true,
      "throws": true,
      "prefix": "ERROR:",
      "color": "red"
    },
    "debug": {
      "stamp": true,
      "verbose": true,
      "prefix": "DEBUG:",
      "color": "cyan"
    },
    "success": {
      "stamp": true,
      "prefix": "SUCCESS:",
      "color": "green"
    }
  };

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
  });

  it('should support dynamic logging methods', function() {
    const testLogger = new Logger({
      allowForceNoThrow: true,
      verbose: true
    });

    testLogger.enableLogging(testConfig);

    Object.keys(testConfig).forEach(method => {
      const methodConfig = testConfig[method];
      const consoleMethod = (typeof console[method] === 'function' ? method : 'log');

      this.sinon.stub(console, consoleMethod);

      if (methodConfig.throws) {
        expect(testLogger[method]).to.throw(Error);
      } else {
        testLogger[method](`Calling: ${method}`);            
      }

      expect(console[consoleMethod].called).to.be.true;

      this.sinon.restore();
    });
  });

  afterEach(function() {
    this.sinon.restore();
  });
});