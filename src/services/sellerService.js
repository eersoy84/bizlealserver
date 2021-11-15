const httpStatus = require('http-status');
const logger = require('../config/logger')
const dbModels = require('../config/dbmodels')
const { user_seller_access: UserSellerAccess, seller: Seller, products: Products, user_cart_items: UserCartItems, product_questions: ProductQuestions } = dbModels;
const sequelize = require('../config/connection')
const ApiError = require('../utils/ApiError');
const seller = require('../models/seller');
const { formattedPrice } = require('../config/helpers')

const getSellerList = async (userId) => {
  const userSellerAccesses = await UserSellerAccess.findAll({
    where: {
      user_id: 23 // userId gelecek 
    },
    include: [{
      model: Seller,
      as: 'seller',
      required: true,
    }]
  })

  if (!userSellerAccesses) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Böyle bir satıcı bulunmamaktadır!');
  }
  // return sellerAccess;
  return getUserSellerAccesses(userSellerAccesses);
}

const getUserSellerAccesses = (userSellerAccesses) => {
  const result = userSellerAccesses.map(item => {
    return {
      permissionId: item.id,
      permission: item.permissions,
      seller: getSeller(item.seller),
    }
  })
  return result
}

const getSeller = (seller) => {
  return {
    id: seller.id,
    status: seller.status,
    name: seller.name,
    marketplaceName: seller.marketplace_name,
    marketplaceLogo: seller.marketplace_logo,
    type: seller.type,
    contactName: seller.contact_name,
    trIdNum: seller.tr_id_num,
    taxOffice: seller.tax_office,
    phone: seller.phone,
    iban: seller.iban,
    adress: seller.adress
  }
}


const getSellerAds = async (reqBody, userId) => {
  const { permissionId } = reqBody;
  var sellerId = await getSellerAccessId(permissionId)
  const products = await Products.findAll({
    where: {
      seller: [sellerId]
    },
    include: [
      {
        association: 'product_questions',
      },
      {
        association: 'product_images',
        required: false,
        attributes: ['id', ['product_id', 'productId'], 'url']
      },
      {
        association: 'model',
        required: false,
        include: [
          {
            association: 'category',
            required: false,
            where: {
              id: sequelize.col('model.category_id')
            }
          },
          {
            association: 'brand',
            required: false,

            where: {
              id: sequelize.col('model.brand_id')
            }
          }
        ]
      },
    ]
  })
  return getSellerProducts(products)

}

const getSellerProducts = (products) => {
  return products.map(product => {
    return getProduct(product)
  })
}
const getProduct = (product) => {
  return {
    adId: product?.id,
    imageUrl: product && product?.product_images && product?.product_images[0]?.url,
    numOrders: product?.num_orders,
    quantity: product?.total_amount,
    normalPrice: product?.normal_price,
    instantPrice: product?.instant_price,
    listingPrice: product?.listing_price,
    modelId: product?.model?.id,
    modelName: product?.model?.name,
    brandId: product?.model?.brand.id,
    brandName: product.model?.brand.name,
    categoryId: product?.model?.category.id,
    categoryName: product?.model?.category.name,
    sellerId: product?.seller,
    description: product?.description,
    images: product?.product_images,
    numOfAskedQuestions: product?.product_questions?.length,
    answeredQuestions: getAnsweredQuestions(product?.product_questions),
    nonAnsweredQuestions: getNonAnsweredQuestions(product?.product_questions),
  }

}

const getAnsweredQuestions = (questions) => {
  const answered = questions?.filter(item => item.seller_answer != null)
  return answered?.map(question => {
    return getQuestion(question)
  })
}
const getNonAnsweredQuestions = (questions) => {
  const nonAnswered = questions?.filter(item => item.seller_answer == null)
  return nonAnswered?.map(question => {
    return getQuestion(question)
  })
}

const getQuestion = (question) => {
  return {
    id: question.id,
    userId: question.user_id,
    productId: question.product_id,
    userQuestion: question.user_question,
    userQuestionDate: question.user_question_date,
    sellerAnswer: question.seller_answer,
    sellerAnswerDate: question.seller_answer_date || null,
    questionApproved: question.question_approved,
    answerApproved: question.answer_approved
  }
}

const getSellerAccessId = async (permissionId) => {
  const access = await UserSellerAccess.findOne({
    where: {
      id: permissionId
    }
  })
  return access.seller_id;
}
const getSellerOrders = async (reqBody, userId) => {
  const { permissionId } = reqBody;
  var sellerId = await getSellerAccessId(permissionId)

  const ordersBySeller = await UserCartItems.findAll({

    order: ['cart_id'],
    include: [
      {
        association: 'cart',
        where: {
          status: ['paid', 'preparing', 'delivering', 'delivered', 'canceled', 'refunded']
        },
      },
      {
        association: 'product',
        required: true,
        where: {
          seller: sellerId
        },
        include: [
          {
            association: 'product_images',
            required: false,
            attributes: ['url']
          },
          {
            association: 'model',
            required: false,
            include: [
              {
                association: 'category',
                required: false,
                where: {
                  id: sequelize.col('product.model.category_id')
                }
              },
              {
                association: 'brand',
                required: false,

                where: {
                  id: sequelize.col('product.model.brand_id')
                }
              }
            ]
          },
        ]
      },
      {
        association: 'user_cart_item_return_requests',
      }
    ]
  })
  return getOrdersBySeller(ordersBySeller)

}

const getOrdersBySeller = (orders) => {
  return orders.map(order => {
    return {
      orderId: order.id,
      adId: order.product_id,
      orderDate: order.date_created,
      shipmentDeadLine: "3 gün icinde",
      amount: order.amount,
      totalPrice: order.total_price,
      instantProfit: calculateInstantProfit(order),
      product: getProduct(order.product),
      returns: getReturns(order.user_cart_item_return_requests),
      status: order.cart.status
    }
  })
}

const calculateInstantProfit = (order) => {
  var instantPrice = order.product.getDataValue('instant_price')
  var totalPrice = order.getDataValue('total_price')
  var instantProfit = (totalPrice - (instantPrice * order.amount)) / 100
  return formattedPrice(instantProfit)
}


const getReturns = (returnRequests) => {
  return returnRequests.map(item => {
    return {
      id: item.id,
      returnAmount: item.return_amount,
      notes: item.notes,
      date: item.date,
      status: item.status
    }
  })
}

const answerQuestion = async (sellerAnswers, userId) => {
  sellerAnswers && sellerAnswers.map(async answer => {
    var question = await ProductQuestions.findByPk(answer.id)
    if (question) {
      question.seller_answer = answer.answer
      question.seller_answer_date = Date.now()
      await question.save()
    }
  })
  return "Sorular başarıyla cevaplandı"
}


module.exports = {
  getSellerList,
  getSellerAds,
  getSellerOrders,
  answerQuestion
};
