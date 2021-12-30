const httpStatus = require('http-status');
const userService = require('./userService');
const ApiError = require('../utils/ApiError');
const models = require('../config/dbmodels')

const { user_cart: UserCart, user_cart_items: UserCartItems, product_reviews: ProductReviews, user_chart_seller_ratings: SellerRatings, user_cart_item_return_requests: UserCartItemReturnRequests } = models;


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

const rateSeller = async (reqBody) => {
  const { cartId, sellerId, ratings } = reqBody
  const cart = await UserCart.findOne({ where: { uuid: cartId } })
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Satıcıyı değerlendirken hata oluştu!")

  const ratingsArray = createRatingsArray(cart.id, sellerId, ratings);
  await SellerRatings.bulkCreate(ratingsArray)
};

const createRatingsArray = (id, sellerId, ratings) => {
  var ratingsArray = [];
  ratings && ratings.map((item) => {
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

const cancelProduct = async (reqBody) => {
  const { id, notes, reasonId, returnAmount } = reqBody
  try {
    await UserCartItemReturnRequests.create({
      user_cart_item_id: id,
      return_reason_id: reasonId,
      return_amount: returnAmount,
      date: Date.now(),
      status: "created",
      notes,
    })
    return;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Ürün iade işlemi sırasında hata oluştu!")
  }

}

const returnProduct = async (reqBody) => {
  const { cartId, userId, adId, comment, rating } = reqBody
  const cart = await UserCart.findOne(cartId)
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Sepetiniz Güncel Değil")
}

module.exports = {
  rateItem,
  rateSeller,
  getRatings,
  cancelProduct,
  returnProduct
};
