const Joi = require('joi');

const cartGet = {
  body: Joi.object().keys({
    cartId: Joi.string().guid().required().min(30).max(60),
    isOrder: Joi.number().integer().valid(0, 1).default(null),
  }),
};
const cartUpdate = {
  body: Joi.object().keys({
    cartId: Joi.string().guid().min(30).max(60).allow(null),
    adId: Joi.number().integer().required().min(0),
    amount: Joi.number().integer().required().min(0),
  }),
};

const cartGetBySeller = {
  body: Joi.object().keys({
    cartId: Joi.string().guid().required().min(30).max(60),
  }),
};


module.exports = {
  cartGet,
  cartUpdate,
  cartGetBySeller
};
