const card = require('./card/card.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(card);
};
