const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');
const redisClient = require('../config/redisClient');
const { keyGeneratorByBody, getCustomPrefix } = require('../config/cacheKeyGenerator');


const cartGet = catchAsync(async (req, res) => {
  const result = await cartService.cartGet(req.body, req.user.id);
  res.status(httpStatus.OK).send(result);
});

const cartGetBySeller = catchAsync(async (req, res) => {
  const result = await cartService.cartGetBySeller(req.body, req.user.id);
  if (result && redisClient.isConnected()) {
    redisClient?.set(keyGeneratorByBody(req, req.user.id), JSON.stringify(result));
  }
  res.status(httpStatus.OK).send(result);
});

const cartUpdate = catchAsync(async (req, res) => {
  const result = await cartService.cartUpdate(req.body, req.user.id);
  res.status(httpStatus.OK).send(result);
});

const getCartList = catchAsync(async (req, res) => {
  const result = await cartService.getCartList(req.user.id);
  if (result && redisClient.isConnected()) {
    redisClient?.set(keyGeneratorByBody(req, req.user.id), JSON.stringify(result));
  }
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  cartGet,
  cartUpdate,
  getCartList,
  cartGetBySeller
};
