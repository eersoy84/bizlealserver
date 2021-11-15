const sequelize = require('./connection');

const initModels = require('../models/init-models');

module.exports = initModels(sequelize);

