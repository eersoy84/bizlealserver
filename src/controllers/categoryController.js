const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const redisClient = require('../config/redisClient');
const { keyGenerator, keyGeneratorByParams } = require('../config/cacheDefaults');


const getCategories = catchAsync(async (req, res) => {
    const categories = await categoryService.getCategories();
    redisClient.set(keyGenerator(req), JSON.stringify(categories), 60);
    res.send(categories);
});

const getCategory = catchAsync(async (req, res) => {
    const result = await categoryService.getCategory(req.params.id);
    redisClient.set(keyGeneratorByParams(req), JSON.stringify(result), 60);
    res.send(result);
});

const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(httpStatus.CREATED).send(category);
});

const updateCategory = catchAsync(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.send(category);
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