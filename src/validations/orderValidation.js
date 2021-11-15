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







module.exports = {
  rateItem,
  rateSeller,
};
