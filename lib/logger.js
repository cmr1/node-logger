'use strict'

// Require colors (in safe mode) for dynamic logging with color
const colors = require('colors/safe')

// Override console.debug to be console.log
// Starting in NodeJS v8.0.0, debug will only work with "attached inspectors"
// https://stackoverflow.com/questions/47146363/nodejs-where-does-console-debug-output-go
console.debug = console.log

/**
 * Logger Helper Class
 */
class Logger {
  /**
   * Create a Logger object
   * @param {object} settings - The settings for this Logger object
   */
  constructor (settings = {}) {
    this.settings = this.options = settings
  }

  /**
   * Enable the logging functions as defined by the config
   */
  enableLogging (config = {}) {
    // Only attempt to enable logging from an object definition
    if (typeof config === 'object') {
      // Loop through logging config by method (function name)
      Object.keys(config).forEach(method => {
        // Get the current method configuration from the logging config by method
        const methodConfig = config[method]

        // Don't allow provided setting to override existing properties
        if (typeof this[method] !== 'undefined') {
          throw new Error(`Cannot override method for logging: '${method}' ... it already exists!`)
        }

        // Create the logging method as a function on the current Logger instance
        this[method] = (...args) => {
          // Determine whether or not to show the message
          //  - If method isn't verbose only OR verbose flag is set
          //  - AND
          //  - The quiet flag is NOT set
          if ((!methodConfig.verbose || this.options.verbose) && !this.options.quiet) {
            // Get the console method to be used for this logging function
            // Check to see if the "console" object has the same function, otherwise just use "log"
            const consoleMethod = (typeof console[method] === 'function' ? console[method] : console['log'])

            // Get the prefix from method config, otherwise set it to blank
            const prefix = (typeof methodConfig.prefix === 'string' ? methodConfig.prefix : '')

            // Get the color from the method config, otherwise set it to blank
            const color = (typeof colors[methodConfig.color] === 'function' ? methodConfig.color : '')

            // Create the output variable
            let output = Logger.colorize(args, color)

            // If a prefix is set, prepend it to the previously created output
            if (prefix.trim() !== '') {
              output = Logger.colorize([prefix], color).concat(output)
            }

            // If the stamp flag is set, prepend the output with a timestamp
            if (methodConfig.stamp) {
              const timeStamp = this.getTimeStamp()
              output = Logger.colorize([`[${timeStamp}]`], color).concat(output)
            }

            // Use the console method obtained above, print the generated output
            consoleMethod(...output)

            // If the throws flag is set, and the force flag isn't allowed AND set
            if (methodConfig.throws === true && !(this.settings.allowForceNoThrow && this.options.force)) {
              // Throw the args as an error
              throw new Error(args)
            }
          }
        }
      })
    }
  }

  /**
   * Get the current Timestamp
   */
  getTimeStamp () {
    // Create new Date object
    const d = new Date()

    // Return date in the format "M/D/YYYY h:i:s AM/PM"
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  }

  /**
   * Colorize each argument that is a string
   * @param {string|array|object} args - Subject(s) to be colorized
   * @param {string} color - The color (i.e. "red") to make the args
   */
  static colorize (args, color) {
    // Verify the color is not an empty string, and it exists as a functions on the colors object
    if (color.trim() !== '' && typeof colors[color] === 'function') {
      // If the arg passed is a string, just colorize it
      if (typeof args === 'string') {
        args = colors[color](args)

      // If the arg is an object
      } else if (typeof args === 'object') {
        // Check if it's an Array
        if (Array.isArray(args)) {
          // Loop through all items in the array
          args.forEach((arg, i) => {
            // If item is a string, override the item at args[i] with it colorized
            if (typeof arg === 'string') {
              args[i] = colors[color](arg)
            }
          })

        // args is just an object
        } else {
          // Loop through object keys
          Object.keys(args).forEach(key => {
            // If item is a string, override the item at args[key] with it colorized
            if (typeof args[key] === 'string') {
              args[key] = colors[color](args[key])
            }
          })
        }
      }
    }

    // Return colorized args
    return args
  }
}

// Export Logger class
module.exports = Logger
