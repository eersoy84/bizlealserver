const httpStatus = require('http-status');
const logger = require('../config/logger')
const dbModels = require('../config/dbmodels')
const { categories: Category, brands: Brand, model: Model, user_favorites: UserFavorites, user_address: UserAddress, products: Product } = dbModels;
const db = require('../config/connection');
const sequelize = require('../config/connection')
const ApiError = require('../utils/ApiError');


const getAds = async () => {
  try {
    return await fetchAds();
  }
  catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "İlanlar yüklenirken hata oluştu!")
  }
};
const fetchAds = async (...adIdArray) => {
  let whereClause = {}
  if (adIdArray?.length > 0) {
    whereClause = { ...whereClause, id: adIdArray }
  }
  const products = await Product.findAll({
    logging: false,
    where: whereClause,
    order: [
      ['id', 'ASC'],
    ],
    include: [
      {
        association: 'model',
        required: false,
        attributes: ['id', 'name'],
        include: [
          {
            association: 'category',
            required: false,
            where: {
              id: sequelize.col('model.category_id')
            },
            attributes: ['id', 'name', 'parentId']
          },
          {
            association: 'brand',
            required: false,
            where: {
              id: sequelize.col('model.brand_id')
            },
            attributes: ['id', 'name']
          }
        ]
      },
      {
        association: 'seller_seller',
      },
      {
        association: 'product_specs',
      },
      {
        association: 'product_images',
        required: false,
        attributes: ['url']
      },
    ]
  })
  return formatProducts(products)
}

const getAdsById = async (adId) => {
  try {
    const products = await fetchAdsById(adId);
    return products[0];
  }
  catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "İlan yüklenirken hata oluştu!")
  }
}
const fetchAdsById = async (adId) => {
  const products = await Product.findOne({
    logging: false,
    where: {
      id: parseInt(adId)
    },
    order: [
      ['id', 'ASC'],
    ],
    include: [
      {
        association: 'model',
        required: false,
        attributes: ['id', 'name'],
        include: [
          {
            association: 'category',
            required: false,
            where: {
              id: sequelize.col('model.category_id')
            },
            attributes: ['id', 'name', 'parentId']
          },
          {
            association: 'brand',
            required: false,
            where: {
              id: sequelize.col('model.brand_id')
            },
            attributes: ['id', 'name']
          }
        ]
      },
      {
        association: 'seller_seller',
      },
      {
        association: 'product_specs',
      },
      {
        association: 'product_images',
        required: false,
        attributes: ['url']
      },
    ]
  })
  return formatProducts([products])
}
const formatProducts = (products) => {
  return products && products.map(product => {
    let images = product?.product_images?.map(image => {
      return { url: image.url }
    });
    return {
      adId: product.id,
      modelId: product.model.id,
      modelName: product.model.name,
      brandId: product.model.brand.id,
      brandName: product.model.brand.name,
      categoryId: product.model.category.id,
      categoryName: product.model.category.name,
      parentId: product.model.category.parentId,
      description: product.description,
      endDate: product.end_date,
      createdDate: product.start_date,
      isActive: product.is_active,
      maxDiscountPercent: product.max_discount,
      maxParticipants: product.max_amount,
      minParticipants: product.min_amount,
      targetPrice: product.target_price / 100,
      quantity: product?.total_amount,
      downpayment: product?.downpayment / 100,
      productPrice: product?.product_price_num,
      sellerId: product?.seller_seller?.id,
      sellerName: product.seller_seller?.marketplace_name,
      sellerLogo: product.seller_seller?.marketplace_logo,
      sellerBussinessName: product?.seller_seller?.name,
      specs: product.product_specs,
      imageUrl: product && product.product_images && product?.product_images[0]?.url,
      images,
      numOrders: product.num_orders,
      instantDiscountPercent: product.instant_discount_percent,
      instantPrice: product.instantPrice,
      participants: product.participants
    }
  })

}

const getInstantAdInfo = async () => {
  try {
    const products = await Product.findAll({ logging: false })
    return fetchInstantAdInfo(products);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Anlık Fiyatlar Yüklenirken Hata Oluştu!")
  }

};
const fetchInstantAdInfo = (products) => {
  return products && products.map(product => {
    return {
      adId: product.id,
      numOrders: product.num_orders,
      instantDiscountPercent: product.instant_discount_percent,
      instantPrice: product.instantPrice,
      participants: product.participants
    }
  })

}

const getFavorites = async (userId) => {
  const favorites = await UserFavorites.findAll({
    logging: false,
    where: {
      user_id: userId
    }
  })
  const adIdArray = favorites.map(favorite => favorite.product_id)
  if (adIdArray?.length === 0) {
    return [];
  }
  return await fetchAds(...adIdArray)
};


const getBin = async (bin) => {
  return await db.query('CALL exposed_get_bin(:bin)',
    { replacements: { bin: bin } })
};

const follow = async (req) => {
  try {
    let result = await UserFavorites.create({ user_id: req.user.id, product_id: req.body.adId })
    if (result) {
      return await getFavorites(req.user.id)
    }
    throw new Error()
  } catch (err) {
    if (err.name == "SequelizeUniqueConstraintError") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Bu ilanı zaten takip ediyordunuz!")
    }
    if (err.name == "SequelizeForeignKeyConstraintError")
      throw new ApiError(httpStatus.BAD_REQUEST, "Böyle bir ilan bulunmamaktadır!")
  }

};

const unfollow = async (req) => {
  try {
    let result = await UserFavorites.destroy(
      {
        where:
          { user_id: req.user.id, product_id: req.body.adId }
      })
    if (result) {
      return await getFavorites(req.user.id)
    }
    throw new Error("Böyle bir ilan bulunmamaktadır")
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err.message)
  };
}

const setAddress = async (addressbody) => {
  const {
    id,
    userId,
    city,
    district,
    addressText,
    phone,
    town,
    country,
    firstName,
    lastName,
    isCorporate,
    isDefault,
    addressTitle,
    companyName,
    taxNumber,
    taxOffice } = addressbody;
  let result = await db.query('CALL exposed_set_address(:user_id, :user_address_id, :city, :district, :address_text, :phone, :town, :country, :first_name, :last_name, :is_corporate, :is_default, :address_title, :company_name, :tax_number, :tax_office)',
    {
      replacements: {
        user_id: userId,
        user_address_id: id,
        city: city,
        district: district,
        address_text: addressText,
        phone: phone,
        town: town,
        country: country,
        first_name: firstName,
        last_name: lastName,
        is_corporate: isCorporate,
        is_default: isDefault,
        address_title: addressTitle,
        company_name: companyName | null,
        tax_number: taxNumber | null,
        tax_office: taxOffice | null,
      }
    })
  if (result) return result[0]
  throw new ApiError(httpStatus.NOT_FOUND, "Adres eklerken/güncellerken bir hata oluştu!")
};

const deleteAddress = async (id) => {
  let result = await db.query('CALL exposed_delete_address(:user_address_id)',
    { replacements: { user_address_id: id } })
  if (result) return result[0]
  throw new ApiError(httpStatus.NOT_FOUND, "Böyle bir adres bulunmamaktadır!")
};




module.exports = {
  getAds,
  getInstantAdInfo,
  getFavorites,
  getBin,
  follow,
  unfollow,
  setAddress,
  deleteAddress,
  getAdsById
};
