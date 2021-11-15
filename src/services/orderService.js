const httpStatus = require('http-status');
const userService = require('./userService');
const ApiError = require('../utils/ApiError');
const models = require('../config/dbmodels')

const { user_cart: UserCart, product_reviews: ProductReviews, user_chart_seller_ratings: SellerRatings } = models;


/**
 * Login with username and password
 * @param {string} cartId
 * @param {string} userId
 * @param {string} comment
 * @param {string} rating
 * @returns {Promise<User>}
 */
const rateItem = async (reqBody) => {
  const { cartId, userId, adId, comment, rating } = reqBody
  const cart = await UserCart.findOne({ where: { uuid: cartId } })
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Ürünü değerlendirirken hata oluştu")

  await ProductReviews.create({
    product_id: adId,
    user_id: userId,
    review_content: comment,
    review_stars: rating
  })
};

/**
 * Logout
 * @param {string} cartId
 * @param {string} sellerId
 * @param {string} ratings
 * @returns {Promise}
 */
const rateSeller = async (reqBody) => {
  const { cartId, sellerId, ratings } = reqBody
  const cart = await UserCart.findOne({ where: { uuid: cartId } })
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Satıcıyı değerlendirken hata oluştu!")

  const ratingsArray = await createRatingsArray(cart.id, sellerId, ratings);
  await SellerRatings.bulkCreate(ratingsArray)
};

const createRatingsArray = async (id, sellerId, ratings) => {
  var ratingsArray = [];
  await ratings && ratings.map((item) => {
    let arrObj = {
      cart_id: id,
      seller_id: sellerId,
      rating_value_id: item.id,
      value: item.value,
      date: Date.now()
    }
    ratingsArray.push(arrObj)

  })
  return ratingsArray;

}

const getRatings = async (reqBody) => {
  const { cartId, userId, adId, comment, rating } = reqBody
  const cart = await UserCart.findOne(cartId)
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Sepetiniz Güncel Değil")

  await ProductReviews.create({
    product_id: adId,
    user_id: userId,
    review_content: comment,
    review_stars: rating
  })
  return;
};

module.exports = {
  rateItem,
  rateSeller,
  getRatings
};
