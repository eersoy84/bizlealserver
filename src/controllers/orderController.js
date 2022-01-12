const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, orderService, tokenService, emailService } = require('../services');
const { redirect_url } = require('../config/iyzipay');
const ApiError = require('../utils/ApiError');

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
  const callback = (result) => res.status(httpStatus.CREATED).send(result)
  await orderService.createOrder(req.body, req.user.id, callback);
})

const retrieveOrder = catchAsync(async (req, res) => {
  const fn = (orderId) => {
    if (!orderId) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Ödeme esnasında bir hata oluştu!")
    }
    res.redirect(`${redirect_url}/siparis/ozet?orderId=${orderId}`)
  }
  orderService.retrieveOrder(req.body.token, req.query, fn);
})

module.exports = {
  rateItem,
  rateSeller,
  getRatings,
  cancelProduct,
  returnProduct,
  createOrder,
  retrieveOrder
};
