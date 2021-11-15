const Joi = require('joi');

const askQuestion = {
  body: Joi.object().keys({
    adId: Joi.number().integer().required().min(0),
    question: Joi.string().required().min(2).max(2048),
  }),
};


module.exports = {
  askQuestion,
};
