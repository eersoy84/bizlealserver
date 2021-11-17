const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const redisClient = require('../config/redisClient');
const { keyGeneratorByBody, getPrefix, getPrefixWithoutUrl } = require('../config/cacheKeyGenerator');


const getCategories = catchAsync(async (req, res) => {
    const result = await categoryService.getCategories();
    if (result) {
        redisClient.set(keyGeneratorByBody(req, null), JSON.stringify(result));
    }
    res.send(result);
});

const getCategory = catchAsync(async (req, res) => {
    const result = await categoryService.getCategory(req.params.id);
    if (result) {
        redisClient.set(keyGeneratorByBody(req, null), JSON.stringify(result));
    }
    res.send(result);
});

const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(httpStatus.CREATED).send(category);
});

// const updateCategory = catchAsync(async (req, res) => {
//     const result = await categoryService.updateCategory(req.params.id, req.body);
//     if (result) {
//         redisClient.deleteWithPrefix(getPrefix(req, null))
//     }
//     res.status(httpStatus.OK).send(result)
// });

const updateCategory = catchAsync(async (req, res) => {
    redisClient.deleteWithPrefix(getPrefixWithoutUrl(req))
    res.status(httpStatus.OK).send('deneme')
});
const deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};