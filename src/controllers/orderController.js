const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, orderService, tokenService, emailService } = require('../services');

const rateItem = catchAsync(async (req, res) => {
  await orderService.rateItem({ ...req.body, userId: req.user.id });
  res.status(httpStatus.CREATED).send();
});

const rateSeller = catchAsync(async (req, res) => {
  await orderService.rateSeller(req.body);
  res.status(httpStatus.CREATED).send();
});

const getRatings = catchAsync(async (req, res) => {
  await orderService.getRatings({ ...req.body, userId: req.user.id });
  res.status(httpStatus.CREATED).send();
});

const cancelProduct = catchAsync(async (req, res) => {
  await orderService.cancelProduct(req.body);
  res.status(httpStatus.CREATED).send();
});

const returnProduct = catchAsync(async (req, res) => {
  await orderService.returnProduct(req.body);
  res.status(httpStatus.CREATED).send();
});



module.exports = {
  rateItem,
  rateSeller,
  getRatings,
  cancelProduct,
  returnProduct
};
