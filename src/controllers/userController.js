const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser({ ...req.body, created_ip: req.socket.remoteAddress });
    res.status(httpStatus.CREATED).send(user.withoutPassword(user.id));
});

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.status(httpStatus.OK).send(user);
});

const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
});

const addPhone = catchAsync(async (req, res) => {
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
});
const editProfile = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.user.id, req.body)
    res.status(httpStatus.OK).send(user);
});

const getUserAddress = catchAsync(async (req, res) => {
    const addresses = await userService.getUserAddress(req.user.id);
    res.status(httpStatus.OK).send(addresses);
});
const getUserOrders = catchAsync(async (req, res) => {
    const orders = await userService.getUserOrders(req.user.id);
    res.status(httpStatus.OK).send(orders);
});

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addPhone,
    editProfile,
    getUserAddress,
    getUserOrders
};