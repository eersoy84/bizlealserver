const Joi = require('joi');

const adQuestions = {
  body: Joi.object().keys({
    permissionId: Joi.number().integer().required().min(1),
    adId: Joi.number().integer().required().min(1),
  }),
};

var answers = Joi.object().keys({
  id: Joi.number().integer().required().min(1),
  answer: Joi.string().required().min(2).max(2048),
})
const answerQuestion = {
  body: Joi.array().items(answers)
};


const ads = {
  body: Joi.object().keys({
    permissionId: Joi.number().integer().required().min(1),
  }),
};

const orders = {
  body: Joi.object().keys({
    permissionId: Joi.number().integer().required().min(1),
  }),
};


module.exports = {
  adQuestions,
  ads,
  orders,
  answerQuestion
};
