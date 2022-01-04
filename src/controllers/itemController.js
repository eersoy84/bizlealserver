const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { itemService } = require('../services');
const redisClient = require('../config/redisClient');

const getQuestions = catchAsync(async (req, res) => {
  let result = await itemService.getQuestions(req.body);
  if (result && redisClient.isConnected()) {
    redisClient?.set(keyGeneratorByBody(req), JSON.stringify(result), 30);
  }
  res.status(httpStatus.OK).send(result);
});

const askQuestion = catchAsync(async (req, res) => {
  await itemService.askQuestion(req.body, req.user.id);
  res.status(httpStatus.OK).send('Sorunuz başarıyla iletildi');
});

module.exports = {
  getQuestions,
  askQuestion,
};
