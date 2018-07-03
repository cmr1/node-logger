'use strict'

const Logger = require('./lib/logger')

const config = {
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
    'throws': false,
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

const myLogger = new Logger({
  verbose: true
})

myLogger.enableLogging(config)

Object.keys(config).forEach(method => {
  myLogger[method](`Testing '${method}' logger method.`)
})
