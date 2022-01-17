const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const models = require('../config/dbmodels');
const iyzicoService = require('./iyzicoService');
const { Iyzipay, url } = require('../config/iyzipay')
const logger = require('../config/logger')

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

const returnProduct = async (reqBody, userId) => {
  const { cartId, adId, comment, rating } = reqBody
  const cart = await UserCart.findOne(cartId)
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Sepetiniz Güncel Değil")
}

const createOrder = async (reqBody, userId) => {
  const { id, shippingAddressId, billingAddressId } = reqBody
  const cart = await UserCart.findOne(
    {
      logging: false,
      where:
      {
        id: id,
        user_id: userId
      },
      include: [{
        association: 'user_cart_items',
        include: [{
          association: 'product',
          include: [{
            association: 'model',
            include: [{
              association: 'category'
            }]
          }
          ]
        }]
      },
      {
        association: 'user',
        attributes: ['id', 'firstName', 'lastName', 'phone', 'created_date', 'email', 'created_ip'],
        include: [{
          association: 'user_addresses',
          where: {
            id: [shippingAddressId, billingAddressId]
          }
        }]
      }]
    }
  )
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Böyle bir sipariş bulunmamaktadır!")
  await updateCartStatusBeforePayment(cart)
  setUserCartItemBlockToDefault(cart);
  return await iyzicoService.createOrderRequest(formatOrderRequest(cart));
}
const setUserCartItemBlockToDefault = async (cart) => {
  let userCartItems = cart.user_cart_items
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        let newCart = await UserCart.findByPk(cart.id)
        if (newCart.status == "paid") {
          logger.info("payment is successfull")
          return
        }
        logger.info("payment is not successfull, proceeding to defaults")
        await userCartItems?.map(async item =>
          await item.update({
            block: 0
          }))
        await cart.update({
          status: "created"
        })
        resolve(true)
      } catch (err) {
        reject(err)
      }
    }, 300 * 1000)
  })

}

const updateCartStatusBeforePayment = async (cart) => {
  let userCartItems = cart.user_cart_items;
  await cart.update({
    status: "blocking"
  })
  await userCartItems.map(async item =>
    await item.update({
      block: 1
    }))
}


const formatOrderRequest = (cart) => {
  let user = cart?.user;
  let addresses = user?.user_addresses;
  let billingAddress;
  let shippingAddress = {
    contactName: `${addresses[0]?.first_name} ${addresses[0]?.last_name}`,
    city: addresses[0]?.city,
    country: addresses[0]?.country,
    address: addresses[0]?.address_text,
    zipCode: addresses[0]?.postalCode
  }
  let callbackUrl = '';
  let shippingId = 0;
  let billingId = 0;
  if (addresses?.length === 1) {
    shippingId = addresses[0].id
    callbackUrl = `${url}/api/orders/retrieve?shippingId=${shippingId}&billingId=${shippingId}`
    billingAddress = shippingAddress
  }
  else {
    billingAddress = {
      contactName: `${addresses[1].first_name} ${addresses[1].last_name}`,
      city: addresses[1].city,
      country: addresses[1].country,
      address: addresses[1].address_text,
      zipCode: '23456'
    }
    shippingId = addresses[0].id
    billingId = addresses[1].id
    callbackUrl = `${url}api/orders/retrieve?shippingId=${shippingId}&billingId=${billingId}`
  }
  let basketItems = cart?.user_cart_items?.map(item => {
    let category = item?.product?.model?.category
    return {
      id: item.id,
      name: item.product.description,
      category1: category.name,
      category2: category.name,
      itemType: 'PHYSICAL',
      price: (parseFloat(item.totalPrice).toFixed(2))
    }
  })
  let result = {
    locale: 'tr',
    conversationId2: '123456789',
    price: (parseFloat(cart.subTotal).toFixed(2)),
    paidPrice: (parseFloat(cart.subTotal).toFixed(2)),
    currency: 'TRY',
    basketId: cart.uuid,
    paymentGroup: 'PRODUCT',
    callbackUrl: callbackUrl,
    enabledInstallments: [2, 3, 6, 9],
    buyer: {
      id: user.id,
      name: user.firstName,
      surname: user.lastName,
      gsmNumber: user.phone || '',
      email: user.email,
      identityNumber: '16954696848',
      lastLoginDate: '2021-12-05 12:43:35',
      registrationDate: '2021-10-05 12:43:35',
      registrationAddress: addresses[0].address_text,
      ip: '82.112.13.11',
      city: addresses[0].city,
      country: addresses[0].country,
      zipCode: '2345667'
    },
    shippingAddress,
    billingAddress,
    basketItems
  }
  return result

}

const retrieveOrder = async (token, params) => {
  let request = {
    locale: Iyzipay.LOCALE.TR,
    token
  }
  let result = await iyzicoService.createRetrieveOrder(request)
  let orderId = result.basketId;
  let paymentId = result.paymentId
  const userCart = await UserCart.findOne({
    where: {
      uuid: orderId
    },
    include: [{
      association: 'user_cart_items'
    }]
  })
  updateCartStatusAfterPayment(userCart, paymentId, params)
  logger.info("ascyn mi?", orderId)
  return orderId
}

const updateCartStatusAfterPayment = async (cart, paymentId, params) => {
  const { shippingId, billingId } = params
  let userCartItems = cart?.user_cart_items
  await userCartItems.map(async item => {
    logger.info("once burası gelmeli", item.id)
    let itemUpdate = await item.update({
      block: 0,
      payment_id: paymentId
    })
    logger.info("2. kısım")
    console.log(itemUpdate)
  })
  logger.info("öncesi cart update")
  await cart.update({
    payment_id: paymentId,
    address_id: parseInt(shippingId),
    invoice_id: parseInt(billingId),
    status: "paid"
  })
  logger.info("sonrası cart update")

}
module.exports = {
  rateItem,
  rateSeller,
  getRatings,
  cancelProduct,
  returnProduct,
  createOrder,
  retrieveOrder
};
