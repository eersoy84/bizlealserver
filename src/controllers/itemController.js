const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');


const askQuestion = catchAsync(async (req, res) => {
  await cartService.askQuestion(req.body, req.user.id);
  res.status(httpStatus.OK).send('Sorunuz başarıyla iletildi');
});


module.exports = {
  askQuestion,
};
