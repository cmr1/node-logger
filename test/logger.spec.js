/* eslint-env mocha */
const expect = require('chai').expect
const sinon = require('sinon')

const Logger = require('../')

describe('Logger', function () {
  const testConfig = {
    'log': {
      'stamp': true,
      'prefix': '',
      'color': 'white'
    },
    'warn': {
      'stamp': true,
      'throws': false,
      'prefix': 'WARN:',
      'color': 'yellow'
    },
    'error': {
      'stamp': true,
      'throws': true,
      'prefix': 'ERROR:',
      'color': 'red'
    },
    'debug': {
      'stamp': true,
      'verbose': true,
      'prefix': 'DEBUG:',
      'color': 'cyan'
    },
    'success': {
      'stamp': true,
      'prefix': 'SUCCESS:',
      'color': 'green'
    }
  }

  beforeEach(function () {
    this.sinon = sinon.sandbox.create()
  })

  it('should support dynamic logging methods', function () {
    const testLogger = new Logger({
      allowForceNoThrow: true,
      verbose: true
    })

    testLogger.enableLogging(testConfig)

    Object.keys(testConfig).forEach(method => {
      const methodConfig = testConfig[method]
      const consoleMethod = (typeof console[method] === 'function' ? method : 'log')

      this.sinon.stub(console, consoleMethod)

      if (methodConfig.throws) {
        expect(testLogger[method]).to.throw(Error)
      } else {
        testLogger[method](`Calling: ${method}`)
      }

      expect(console[consoleMethod].called).to.eql(true)

      this.sinon.restore()
    })
  })

  it('should throw error attempting to override existing method', function () {
    const testLogger = new Logger({
      allowForceNoThrow: true,
      verbose: true
    })

    const badConfig = Object.assign({}, testConfig, {
      getTimeStamp: {
        stamp: true,
        prefix: 'BAD',
        color: 'red'
      }
    })

    const attempt = () => {
      testLogger.enableLogging(badConfig)
    }

    expect(attempt).to.throw('Cannot override method for logging: \'getTimeStamp\' ... it already exists!')
  })

  it('should colorize basic string', function () {
    const stringInput = 'Hello world'
    const colorOutput = Logger.colorize(stringInput, 'red')

    expect(colorOutput).to.eql(`\u001b[31m${stringInput}\u001b[39m`)
  })

  it('should return unaltered string with invalid color', function () {
    const stringInput = 'Hello world'
    const colorOutput = Logger.colorize(stringInput, 'bscolor')

    expect(colorOutput).to.eql(stringInput)
  })

  it('should return unaltered number with number args', function () {
    const numberInput = 10
    const colorOutput = Logger.colorize(numberInput, 'red')

    expect(colorOutput).to.eql(numberInput)
  })

  it('should colorize a non-array object', function () {
    const objectInput = {
      hello: 'world',
      foo: 'bar'
    }

    const colorOutput = Logger.colorize(objectInput, 'red')

    expect(colorOutput).to.eql(objectInput)
  })

  afterEach(function () {
    this.sinon.restore()
  })
})
