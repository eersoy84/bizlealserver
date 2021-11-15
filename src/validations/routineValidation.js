const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const follow = {
  body: Joi.object().keys({
    adId: Joi.number().integer().required(),
  }),
};

const unfollow = {
  body: Joi.object().keys({
    adId: Joi.number().integer().required(),
  }),
};


const bin = {
  body: Joi.object().keys({
    bin: Joi.number().integer().required().min(6),
  }),
};
const deleteAddress = {
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const setAddress = {
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    city: Joi.string().required(),
    district: Joi.string().required(),
    addressText: Joi.string().required(),
    phone: Joi.number().integer().required(),
    town: Joi.string().required(),
    country: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    isCorporate: Joi.number().integer().required().valid(1, 0),
    isDefault: Joi.number().required().valid(0,1).default(0),
    addressTitle: Joi.string().required(),
    companyName: Joi.string(),
    taxNumber: Joi.string(),
    taxOffice: Joi.string(),
  }),
};
module.exports = {
  follow,
  unfollow,
  bin,
  setAddress,
  deleteAddress
};
