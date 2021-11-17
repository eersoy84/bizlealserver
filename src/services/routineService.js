const httpStatus = require('http-status');
const logger = require('../config/logger')
const models = require('../config/dbmodels')

const { user_favorites: UserFavorites, user_address: UserAddress } = models;

const db = require('../config/connection');


const ApiError = require('../utils/ApiError');

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
    await UserFavorites.create({ user_id: req.user.id, product_id: req.body.adId })
    return await getFavorites(req.user.id)
  } catch (err) {
    if (err.name == "SequelizeUniqueConstraintError") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Bu ilanı zaten takip ediyordunuz!")
    }
    if (err.name == "SequelizeForeignKeyConstraintError")
      throw new ApiError(httpStatus.BAD_REQUEST, "Böyle bir ilan bulunmamaktadır!")
  }
  return result

};

const unfollow = async (req) => {
  await UserFavorites.destroy(
    {
      where:
        { user_id: req.user.id, product_id: req.body.adId }
    })
  return await getFavorites(req.user.id)
};

const setAddress = async (addressbody) => {
  const { userId, id,
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
  console.log("addressbody", addressbody)
  return await db.query('CALL exposed_set_address(:user_id, :user_address_id, :city, :district, :address_text, :phone, :town, :country, :first_name, :last_name, :is_corporate, :is_default, :address_title, :company_name, :tax_number, :tax_office)',
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
};

const deleteAddress = async (id) => {
  return await db.query('CALL exposed_delete_address(:user_address_id)',
    { replacements: { user_address_id: id } })
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
