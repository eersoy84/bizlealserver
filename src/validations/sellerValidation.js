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
const createSubMerchant = {
  body: Joi.object().keys({
    type: Joi.number().required().valid(1, 2, 3),
    address: Joi.string().required(),
    taxOffice: Joi.string().required(),
    name: Joi.string().required(),
    marketplaceName: Joi.string().required(),
    marketplaceLogo: Joi.string().required(),
    contactName: Joi.string().required(),
    phone: Joi.number().required(),
    trIdNum: Joi.number().required(),
    iban: Joi.string().required(),
    email: Joi.string().required(),
    status: Joi.string().allow('', null),
    
  }),
};
const updateSubMerchant = {
  body: Joi.object().keys({
    permissionId: Joi.number().integer().required().min(1),
  }),
};


module.exports = {
  adQuestions,
  ads,
  orders,
  answerQuestion,
  createSubMerchant,
  updateSubMerchant
};
