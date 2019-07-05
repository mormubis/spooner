if (process.env.NODE_ENV === 'production') {
  module.exports = require('./es/spooner.production.js');
} else {
  module.exports = require('./es/spooner.development.js');
}
