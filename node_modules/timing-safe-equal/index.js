'use strict'

var crypto = require('crypto')

if (typeof crypto.timingSafeEqual === 'function') {
  module.exports = crypto.timingSafeEqual
} else {
  module.exports = require('./browser')
}
