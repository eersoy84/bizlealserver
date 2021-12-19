const httpStatus = require('http-status');
const logger = require('../config/logger')
const dbModels = require('../config/dbmodels')
const { categories: Category, brands: Brand, model: Model } = dbModels;

const ApiError = require('../utils/ApiError');

const db = require('../config/connection')



/**
 * Create a user
 * @param {Object} categoryBody
 * @returns {Promise<User>}
 */
const createCategory = async (categoryBody) => {
  return Category.create(categoryBody);
};

/**
 * Query for users
 * @param {Object} filter - Mysql filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getCategories = async () => {
  return await Category.findAll(
    {
      logging: false,
      include: [
        {
          association: 'subCategories',
          include: [
            {
              association: 'brands',
              attributes: ['id', 'name',
                // [sequelize.fn('COUNT', sequelize.col('subCategories.brands.models.products.id')), 'count']
              ],
              through: {
                attributes: ['id', 'name', 'brand_id', 'category_id']
              },

            }
          ],
        },
        {
          association: 'brands',
          attributes: ['id', 'name',
            // [sequelize.fn('COUNT', sequelize.col('categories.brands.models.id')), 'count'],
          ],
          through: {
            attributes: ['id', 'name', 'brand_id', 'category_id']
          },
        },
      ],
      // group: ['subCategories.brands.id'],

    }
  );
};


/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getCategory = async (id) => {
  return await Category.findByPk(id);
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
const updateCategory = async (id, updateBody) => {
  const val = await getUserByPk(id);
  if (!val) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(val, updateBody);
  await Category.save();
  return val;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteCategory = async (userId) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
