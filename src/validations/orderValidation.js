const Joi = require('joi');

const rateItem = {
  body: Joi.object().keys({
    cartId: Joi.string().guid().required().min(30).max(60),
    adId: Joi.number().integer().required(),
    comment: Joi.string().required().max(2048),
    rating: Joi.number().integer().required().min(1).max(5),
  }),
};


const rateSeller = {
  body: Joi.object().keys({
    cartId: Joi.string().guid().required().min(30).max(60),
    sellerId: Joi.number().integer().required().min(1),
    ratings: Joi.array().items({
      id: Joi.number().integer().required().valid(1, 3, 4, 5),
      value: Joi.when('id', [
        { is: 1, then: Joi.number().integer().required().valid(1, 2, 3, 4, 5) },
        { is: 3, then: Joi.number().integer().required().valid(1, 2, 3, 4, 5) },
        { is: 4, then: Joi.number().integer().required().valid(1, 2, 3, 4, 5) },
        { is: 5, then: Joi.string() }
      ],
      )
    })
  }),
};

const cancelProduct = {
  body: Joi.object().keys({
    id: Joi.number().integer().required().min(1),
    notes: Joi.string().required().max(2048),
    reasonId: Joi.number().integer().required().min(1),
    returnAmount: Joi.number().integer().required().min(1),
  }),
};


const returnProduct = {
  body: Joi.object().keys({
    cartId: Joi.string().guid().required().min(30).max(60),
    adId: Joi.number().integer().required(),
    notes: Joi.string().required().max(2048),
    reason: Joi.string().required().max(2048),
    returnAmount: Joi.number().integer().required().min(1),
  }),
};

const createOrder = {
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    shippingAddressId: Joi.number().integer().required(),
    billingAddressId: Joi.number().integer().required(),
  }),
};







module.exports = {
  rateItem,
  rateSeller,
  cancelProduct,
  returnProduct,
  createOrder
};
