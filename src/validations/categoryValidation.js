const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    parrent: Joi.number().integer(),
    url: Joi.string(),
    disabled: Joi.number().required().integer().valid(1, 0),
  }),
};


const getCategory = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      parrent: Joi.number().integer(),
      url: Joi.string().allow('').optional(),
      disabled: Joi.number().required().integer().valid(1, 0),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
