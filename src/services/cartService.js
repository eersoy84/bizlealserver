const httpStatus = require('http-status');
const logger = require('../config/logger')
const dbModels = require('../config/dbmodels')
const { User, user_cart: UserCart, user_cart_items: UserCartItem,
  products: Product, product_questions: ProductQuestion, return_reasons: ReturnReasons,
  rating_values: RatingValues
} = dbModels;
const sequelize = require('../config/connection')
const ApiError = require('../utils/ApiError');
const seller = require('../models/seller');
const { formattedPrice } = require('../config/helpers')

const emptyCart = {
  info: {},
  items: [],
  ratings: [],
  taxes: []
}

const cartGet = async (reqBody, userId) => {
  try {
    const { cartId, isOrder } = reqBody;
    const userCart = await UserCartFindOne(cartId, userId, isOrder)
    if (!userCart) {
      return emptyCart
    }
    return getUserCart(userCart);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Beklenmedik bir hata oluştu")
  }

}
const cartGetBySeller = async (reqBody, userId) => {
  const { cartId } = reqBody;
  const userCart = await UserCartFindOne(cartId, userId, 1)

  if (!userCart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Böyle bir sipariş bulunmamaktadır!');
  }
  return getUserCartBySeller(userCart);
}

const getUserCartBySeller = (cart) => {
  var totalProfit = 0;

  const userCartItems = cart?.user_cart_items

  const groupBy = (array, property) => {
    return array.reduce((result, userCartItem) => {
      const key = userCartItem.product.seller_seller[property];
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(userCartItem);
      return result;
    }, {});
  }
  const userCartitemsBySeller = groupBy(userCartItems || [], 'id');

  var sellers = [];
  for (var key in userCartitemsBySeller) {
    const itemsByKey = userCartitemsBySeller[key];
    var initialValue = { id: 0, name: '', marketplace_logo: '', marketplace_name: '', items: [] }
    const reducer = (result, item) => {
      var seller = item.product.seller_seller;
      var profit = item.amount * (item.product.getDataValue('normal_price') - item.product.getDataValue('instant_price')) / 100
      totalProfit += profit
      result.id = seller.id
      result.name = seller.name,
        result.marketplace_logo = seller.marketplace_logo,
        result.marketplace_name = seller.marketplace_name,
        result.items = [...result.items, getUserCartItem(item, profit)]
      return result;
    }
    sellers = [...sellers, itemsByKey.reduce(reducer, initialValue)]
  }

  return {
    info: getUserCartInfo(cart, totalProfit),
    sellers
  }
}


const getUserCart = (cart) => {
  let totalProfit = 0;
  const userCartItems = cart?.user_cart_items?.map(item => {
    let profit = item.amount * (item.product.getDataValue('normal_price') - item.product.getDataValue('instant_price')) / 100
    totalProfit += profit
    return getUserCartItem(item, profit)
  })
  return {
    info: getUserCartInfo(cart, totalProfit),
    items: userCartItems,
    ratings: getUnique(cart?.user_chart_seller_ratings),
    taxes: []
  }
}

const getUserCartInfo = (cart, totalProfit) => {
  return {
    id: cart?.id,
    uuid: cart?.uuid,
    subTotal: cart?.sub_total,
    totalProfit: formattedPrice(totalProfit),
    invoiceId: cart?.invoice_id,
    dateCreated: cart?.dateCreated,
    datePassed: cart?.datePassed,
    status: cart?.status,
    shippingId: cart?.address_id,
  }

}
const getUserCartItem = (item, profit) => {
  let numOfReturnedItems = 0;
  const returns = item.user_cart_item_return_requests?.map(returnItem => {
    numOfReturnedItems += returnItem?.return_amount | 0
    return {
      id: returnItem.id,
      returnAmount: returnItem.return_amount,
      date: returnItem.date,
      status: returnItem.status
    }
  })
  let reviewAvailable = item.product?.product_reviews?.length > 0 ? false : true;
  return {
    id: item.id,
    adId: item.product.id,
    totalPrice: item.total_price,
    dateCreated: item.date_created,
    cartId: item.cart_id,
    reviewAvailable,
    amount: item.amount,
    profit: formattedPrice(profit),
    product: item?.product && getProduct(item.product),
    returnableAmount: item.amount - numOfReturnedItems,
    returns: returns,
    deliveryStatus: item.delivery_status,
  }
}
const getProduct = (product) => {
  return {
    adId: product?.id,
    imageUrl: product && product.product_images && product?.product_images[0]?.url,
    numOrders: product?.num_orders,
    quantity: product?.total_amount,
    normalPrice: product?.normal_price,
    normalPriceInt: product?.product_price_num,
    instantPrice: product?.instant_price,
    modelId: product?.model_id,
    brandName: product.model?.brand.name,
    brandId: product.model?.brand.id,
    modelName: product.model?.name,
    categoryName: product?.model?.category.name,
    categoryId: product?.model?.category.id,
    sellerId: product?.seller_seller?.id,
    sellerName: product.seller_seller?.name,
    sellerLogo: product.seller_seller?.marketplace_logo,
    sellerMarketPlaceName: product?.seller_seller?.marketplace_name,
    description: product.description,
  }
}
const UserCartFindOne = async (cartId, userId, isOrder) => {
  return await UserCart?.findOne({
    logging: false,
    where: {
      uuid: (cartId === null || cartId === undefined) ? null : cartId,
      user_id: userId,
      status: (isOrder === 0 || isOrder === null) ? ['created', 'blocking'] : ['paid', 'preparing', 'delivering', 'delivered', 'canceled', 'refunded']
    },
    include: [
      {
        model: UserCartItem,
        required: true,
        as: 'user_cart_items',
        attributes: ['id', 'cart_id', 'amount', 'total_price', 'date_created', 'delivery_status'],
        include: [
          {
            association: 'product',
            attributes: ['id', 'normal_price', 'instant_price', 'total_amount', 'num_orders'],
            include: [
              {
                association: 'product_reviews',
                required: false,
                where: {
                  user_id: userId, // userId gelecek
                  product_id: sequelize.col('user_cart_items.product_id')
                },
              },
              {
                association: 'product_images',
                required: false,
                attributes: ['url']
              },
              {
                association: 'seller_seller',
              },
              {
                association: 'model',
                required: false,

                include: [
                  {
                    association: 'category',
                    required: false,
                    where: {
                      id: sequelize.col('user_cart_items.product.model.category_id')
                    }
                  },
                  {
                    association: 'brand',
                    required: false,

                    where: {
                      id: sequelize.col('user_cart_items.product.model.brand_id')
                    }
                  }
                ]
              },
            ]
          },
          {
            association: 'user_cart_item_return_requests',
          },
        ]
      },
      {
        association: 'user_chart_seller_ratings',
        required: false,
        where: {
          cart_id: sequelize.col('user_cart.id')
        }
      },
    ],
  })

}

const getUnique = (array) => {
  let arr1 = array.map(item => item.seller_id)
  let res1 = arr1.filter((value, index, self) => {
    return self.indexOf(value) === index
  })
  return res1;
  // return array?.map(item => item.seller_id).filter((value, index, self) => self.indexOf(value) === index)
}

const cartUpdate = async (reqBody, userId) => {
  const { cartId, adId, amount } = reqBody;
  try {
    const product = await Product.findOne({
      where: {
        id: adId
      },
    })
    const userCart = await UserCartFindOne(cartId, userId, isOrder = null);
    let newCart;
    let remainingNumOfItemsInStock = product?.total_amount - (product?.num_orders + product?.blocking_stock)
    if (!userCart) {
      checkRemainingNumOfItemsInStock(remainingNumOfItemsInStock, amount)
      const cartId = await createNewCart(userId, product, amount)
      newCart = await UserCartFindOne(cartId, userId, isOrder = null);
    }
    else {
      const userCartItemsLength = userCart?.user_cart_items?.length;
      const item = userCart?.user_cart_items?.find(item => item.product.id == adId)
      if (item) {
        if (amount < 0) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Girdiğiniz adet geçersiz!")
        }
        else if (amount == 0) {
          if (userCartItemsLength === 1) {
            await userCart.destroy()
            return emptyCart
          }
          var diff = amount - item.amount
          await calculateCartSubTotal(userCart, item.product, diff)
          await item.destroy();
        } else {
          checkRemainingNumOfItemsInStock(remainingNumOfItemsInStock, amount)
          var diff = amount - item.amount
          item.amount = amount;
          await item.save();
          await calculateCartSubTotal(userCart, item.product, diff)
        }
      } else {
        if (amount <= 0) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Girdiğiniz adet geçersiz!")
        }
        checkRemainingNumOfItemsInStock(remainingNumOfItemsInStock, amount)
        await createNewCartItem(userCart, product, amount)
      }
      newCart = await UserCartFindOne(cartId, userId, isOrder = null);
    }
    return getUserCart(newCart)
  }
  catch (err) {
    throw new ApiError(err.statusCode, err.message)
  }

}

const checkRemainingNumOfItemsInStock = (remainingNumOfItemsInStock, amount) => {
  if (remainingNumOfItemsInStock <= 0) {
    throw new ApiError(httpStatus.FORBIDDEN, `Bü ürün tükenmiştir!`)
  }
  if (amount > remainingNumOfItemsInStock) {
    throw new ApiError(httpStatus.FORBIDDEN, `Bu üründen maksimum ${remainingNumOfItemsInStock} adet satınalabilirsiniz!`)
  }
}

const calculateCartSubTotal = async (userCart, product, diff) => {
  var newItemPrice = diff * product.getDataValue('normal_price')
  userCart.sub_total = userCart.getDataValue('sub_total') + newItemPrice
  await userCart.save()

}
const createNewCartItem = async (userCart, product, amount) => {
  await UserCartItem.create(getCartItem(userCart.id, product, amount))
  await calculateCartSubTotal(userCart, product, amount)
}

const createNewCart = async (userId, product, amount) => {
  const subTotal = amount * product.getDataValue('normal_price')
  const userCart = await UserCart.create({
    user_id: userId,
    status: "created",
    sub_total: subTotal,
    date_created: Date.now(),
    date_updated: Date.now(),
    invoice_id: null,
    payment_id: null,
    address_id: null,
  })
  await UserCartItem.create(
    getCartItem(userCart.id, product, amount)
  )
  let newCart = await UserCart.findByPk(userCart.id)
  return newCart.uuid
}

const getCartItem = (id, product, amount) => {
  return {
    cart_id: id,
    product_id: product.id,
    amount: amount,
    payment_id: null,
    block: 0,
    date_created: Date.now(),
    date_updated: Date.now()
  }

}


const UserCarts = async (userId) => {
  const userCarts = await UserCart.findAll({
    where: {
      status: ["paid"],
      user_id: userId
    },
    include: [
      {
        model: UserCartItem,
        required: true,
        as: 'user_cart_items',
        attributes: ['id', 'cart_id', 'amount', 'total_price', 'date_created'],
        include: [
          {
            association: 'product',
            attributes: ['id', 'normal_price', 'instant_price'],
          },
        ]
      },
    ],
  })
  return userCarts;
}

const getCartList = async (userId) => {
  const userCarts = await UserCarts(userId);
  const userCartsAll = userCarts?.map(userCart => {
    var totalProfit = 0;
    userCart.user_cart_items.map(userCartItem => {
      var profit = userCartItem.amount * (userCartItem.product.getDataValue('normal_price') - userCartItem.product.getDataValue('instant_price')) / 100
      return totalProfit += profit
    })
    return getUserCartInfo(userCart, totalProfit)
  })
  return userCartsAll;
}


const getReturnReasons = async () => {
  const reasons = await ReturnReasons.findAll();
  if (!reasons) throw new ApiError(httpStatus.BAD_REQUEST, "Hata oluştu!")
  return reasons.map(reason => {
    return {
      id: reason.id,
      reasonText: reason.reason_text,
      commentRequired: reason.comment_required,
      formtype: reason.formType
    }
  })

}
const getRatingForm = async () => {
  const ratingValues = await RatingValues.findAll();
  if (!ratingValues) throw new ApiError(httpStatus.BAD_REQUEST, "Hata oluştu!")
  return ratingValues
}

module.exports = {
  cartGet,
  cartUpdate,
  getCartList,
  cartGetBySeller,
  getReturnReasons,
  getRatingForm
};
