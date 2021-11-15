const httpStatus = require('http-status');
const logger = require('../config/logger')
const models = require('../config/dbmodels')
const { User, user_address: UserAddress, user_orders: UserOrders } = models;


const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  //Check if email is taken first
  if (await User.associate(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bu hesaba tanımlı e-posta adresi bulunmaktadır');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const usersList = await User.paginate(filter, options);
  return usersList;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserByPk = async (id) => {
  return User.findByPk(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } })
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Get user address by userId
 * @param {ObjectId} userId
 * @returns {Promise<UserAddress>}
 */
const getUserAddress = async (userId) => {
  return await UserAddress.findAll({
    where: {
      user_id: userId,
    }
  });
};


/**
 * Get user address by userId
 * @param {ObjectId} userId
 * @returns {Promise<UserOrders>}
 */
const getUserOrders = async (userId) => {
  return await UserOrders.findAll({
    where: {
      user_id: userId,
    }
  });
};

module.exports = {
  createUser,
  queryUsers,
  getUserByPk,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserAddress,
  getUserOrders
};
