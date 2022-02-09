const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { routineService } = require('../services');
const { keyGeneratorByBody, getPrefix, getCustomPrefix } = require('../config/cacheKeyGenerator');
const redisClient = require('../config/redisClient');
const logger = require('../config/logger');

const getAds = catchAsync(async (req, res) => {
    const result = await routineService.getAds();
    if (result && redisClient.isConnected()) {
        redisClient?.set(keyGeneratorByBody(req), JSON.stringify(result), 60);
    }
    res.send(result);
});
const getAdsById = catchAsync(async (req, res) => {
    const adId = req.params.adId
    console.log("params", req.params)
    console.log("query", req.query?.seoUrl)
    const result = await routineService.getAdsById(adId);
    if (result && redisClient.isConnected()) {
        redisClient?.set(keyGeneratorByBody(req), JSON.stringify(result), 60);
    }
    res.send(result);
});
const getAdsCdn = catchAsync(async (req, res) => {
    const result = await routineService.getAdsCdn();
    if (result && redisClient.isConnected()) {
        redisClient?.set(keyGeneratorByBody(req, null), JSON.stringify(result), 60);
    }
    res.send(result);
});

const getInstantAdInfo = catchAsync(async (req, res) => {
    const result = await routineService.getInstantAdInfo();
    res.status(httpStatus.OK).send(result);
});

const getFavorites = catchAsync(async (req, res) => {
    logger.info("Geliyor mu buraya")
    // const result = await routineService.getFavorites(req.user.id);
    const result = await routineService.getFavorites(129);
    if (result && redisClient.isConnected()) {
        redisClient?.set(keyGeneratorByBody(req, req.user.id), JSON.stringify(result));
    }
    res.status(httpStatus.OK).send(result);
});

const follow = catchAsync(async (req, res) => {
    const result = await routineService.follow(req);
    if (result && redisClient.isConnected()) {
        await redisClient?.deleteWithPrefix(getCustomPrefix(req.baseUrl, "/favorites", req.user.id));
    }
    res.status(httpStatus.CREATED).send(result);
});

const unfollow = catchAsync(async (req, res) => {
    const result = await routineService.unfollow(req);
    if (result && redisClient.isConnected()) {
        await redisClient?.deleteWithPrefix(getCustomPrefix(req.baseUrl, "/favorites", req.user.id));
    }
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
    deleteAddress,
    getAdsById
};