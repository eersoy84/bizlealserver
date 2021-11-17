const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { sellerService } = require('../services');
const { keyGeneratorByBody, getPrefix } = require('../config/cacheKeyGenerator');


const getSellerList = catchAsync(async (req, res) => {
  const result = await sellerService.getSellerList(req.user.id);
  if (result) {
    redisClient.set(keyGeneratorByBody(req, req.user.id), JSON.stringify(result), 60);
  }
  res.status(httpStatus.OK).send(result);
});

const getSellerAds = catchAsync(async (req, res) => {
  const result = await sellerService.getSellerAds(req.body, req.user.id);
  if (result) {
    redisClient.set(keyGeneratorByBody(req, req.user.id), JSON.stringify(result), 60);
  }
  res.status(httpStatus.OK).send(result);
});

const getSellerOrders = catchAsync(async (req, res) => {
  const result = await sellerService.getSellerOrders(req.body, req.user.id);
  if (result) {
    redisClient.set(keyGeneratorByBody(req, req.user.id), JSON.stringify(result), 60);
  }
  res.status(httpStatus.OK).send(result);
});
const answerQuestion = catchAsync(async (req, res) => {
  const result = await sellerService.answerQuestion(req.body, req.user.id);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getSellerList,
  getSellerAds,
  getSellerOrders,
  answerQuestion
};
