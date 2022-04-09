'use strict'
const packageJSON = require('../package.json')

module.exports = {
  NODE_ENV: '"production"',
  APP_ENV: JSON.stringify(process.env.APP_ENV),
  VERSION: JSON.stringify(packageJSON.version)
}
