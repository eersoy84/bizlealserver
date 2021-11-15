const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { routineService } = require('../services');

const getAds = catchAsync(async (req, res) => {
    const result = await routineService.getAds(req.user.id);
    res.send(result);
});

const getAdsCdn = catchAsync(async (req, res) => {
    const result = await routineService.getAdsCdn();
    res.send(result);
});

const getInstantAdInfo = catchAsync(async (req, res) => {
    const result = await routineService.getInstantAdInfo();
    res.send(result);
});

const getFavorites = catchAsync(async (req, res) => {
    const result = await routineService.getFavorites(req.user.id);
    res.send(result);
});

const follow = catchAsync(async (req, res) => {
    const result = await routineService.follow(req);
    res.status(httpStatus.CREATED).send(result);
});

const unfollow = catchAsync(async (req, res) => {
    const result = await routineService.unfollow(req);
    res.status(httpStatus.OK).send(result);
});


const getBin = catchAsync(async (req, res) => {
    const result = await routineService.getBin(req.body.bin);
    res.status(httpStatus.OK).send(result);
});
const setAddress = catchAsync(async (req, res) => {
    const result = await routineService.setAddress({ ...req.body, userId: req.user.id });
    res.status(httpStatus.CREATED).send(result);
});

const deleteAddress = catchAsync(async (req, res) => {
    const result = await routineService.deleteAddress(req.body.id);
    res.status(httpStatus.OK).send(result);
});



module.exports = {
    getAds,
    getAdsCdn,
    getInstantAdInfo,
    getFavorites,
    getBin,
    follow,
    unfollow,
    setAddress,
    deleteAddress
};