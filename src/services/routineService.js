const httpStatus = require('http-status');
const logger = require('../config/logger')
const models = require('../config/dbmodels')

const { user_favorites: UserFavorites, user_address: UserAddress } = models;

const db = require('../config/connection');


const ApiError = require('../utils/ApiError');
const { getUserAddress } = require('./userService');

const getAds = async (userId) => {
  return await db.query('CALL exposed_list_ads(:user_maybe)',
    { replacements: { user_maybe: userId ?? 0 } })
};

const getAdsCdn = async () => {
  return await db.query('CALL ads_calc()')
};

const getInstantAdInfo = async () => {
  return await db.query('CALL exposed_instant_ad_info()')
};

const getFavorites = async (userId) => {
  const favorites = await UserFavorites.findAll({
    logging: false,
    where: {
      user_id: userId
    }
  })
  return favorites.map(favorite => favorite.product_id)
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
    if(result) return result[0]
    throw new ApiError(httpStatus.NOT_FOUND, "Böyle bir adres bulunmamaktadır!")
};


module.exports = {
  getAds,
  getAdsCdn,
  getInstantAdInfo,
  getFavorites,
  getBin,
  follow,
  unfollow,
  setAddress,
  deleteAddress
};
