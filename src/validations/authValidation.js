const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    csrfToken: Joi.string().allow('', null),
    callbackUrl: Joi.string().allow('', null),
    redirect: Joi.boolean(),
    json: Joi.boolean(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};


const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const updatePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
const googleLogin = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};
const facebookLogin = {
  body: Joi.object().keys({
    accessToken: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};


module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  updatePassword,
  verifyEmail,
  googleLogin,
  facebookLogin
};
