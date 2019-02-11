// Initializes the `card` service on path `/card`
const card = require('./card');
const createModel = require('../../models/card.model');
const hooks = require('./card.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/card', new card(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('card');

  service.hooks(hooks);
};
