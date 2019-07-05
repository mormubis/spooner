if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/spooner.production.js');
} else {
  module.exports = require('./dist/cjs/spooner.development.js');
}
