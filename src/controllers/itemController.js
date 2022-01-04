const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { itemService } = require('../services');
const redisClient = require('../config/redisClient');
const { keyGeneratorByBody, getCustomPrefixWithParams } = require('../config/cacheKeyGenerator');

const getQuestions = catchAsync(async (req, res) => {
  let result = await itemService.getQuestions(req.body);
  if (result && redisClient.isConnected()) {
    await redisClient?.set(keyGeneratorByBody(req), JSON.stringify(result));
  }
  res.status(httpStatus.OK).send(result);
});

const askQuestion = catchAsync(async (req, res) => {
  const result = await itemService.askQuestion(req.body, req.user.id);
  if (result && redisClient.isConnected()) {
    await redisClient?.deleteWithPrefix(getCustomPrefixWithParams(req.baseUrl, "/questions", { adId: req.body.adId }));
  }
  res.status(httpStatus.OK).send('Sorunuz başarıyla iletildi');
});

const getReviews = catchAsync(async (req, res) => {
  let result = await itemService.getReviews(req.body);
  if (result && redisClient.isConnected()) {
    await redisClient?.set(keyGeneratorByBody(req), JSON.stringify(result), 30);
  }
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getQuestions,
  askQuestion,
  getReviews
};
