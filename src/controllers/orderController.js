const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, orderService, tokenService, emailService } = require('../services');
const { redirect_url } = require('../config/iyzipay');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

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

const createOrder = catchAsync(async (req, res) => {
  const result = await orderService.createOrder(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(result)
})

const retrieveOrder = catchAsync(async (req, res) => {
  const cartId = await orderService.retrieveOrder(req.body.token, req.query);
  logger.info(`orderId: ${cartId}`)
  if (!cartId) {
    res.redirect(`${redirect_url}/siparis-ozet/hata`)
  } else {
    res.redirect(`${redirect_url}/siparis-ozet/basarili/${cartId}`)
  }
})

module.exports = {
  rateItem,
  rateSeller,
  getRatings,
  cancelProduct,
  returnProduct,
  createOrder,
  retrieveOrder,
};
