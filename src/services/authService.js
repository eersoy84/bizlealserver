const httpStatus = require('http-status');
const tokenService = require('./tokenService');
const userService = require('./userService');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const logger = require('../config/logger')
const googleClient = require('../config/googleAuth')
const models = require('../config/dbmodels');
const { User } = models;
const { redirect_url } = require('../config/iyzipay');
const axios = require('axios')
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.checkPassword(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Kullanıcı adınız veya şifreniz hatalı!');
  }
  return user.withoutPassword(user.id);
};
const googleLogin = async (code, ip) => {
  const { payload } = await googleClient.verifyIdToken({
    idToken: code,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  if (!payload) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Google\'a kayıtlı böyle bir kullanıcı bulunamamıştır!');
  }
  const user = await userService.getUserByEmail(payload.email)
  if (!user) {
    let user = await User.create({
      email: payload.email,
      phone: payload.phone || null,
      email_confirmed: payload.email_verified ? 1 : 0,
      firstName: payload.given_name,
      lastName: payload.family_name,
      image: payload.picture,
      created_date: Date.now(),
      created_ip: ip,
      password: null
    })
    return user.withoutPassword(user.id)
  }
  return user.withoutPassword(user.id)
}
const facebookLogin = async (reqBody, ip) => {
  const { accessToken, userId } = reqBody;
  let urlGraphFacebook = `https://graph.facebook.com/v12.0/${userId}?fields=first_name,last_name,email,picture&access_token=${accessToken}`
  try {
    let response = await axios.get(urlGraphFacebook)
    const { first_name, last_name, email, picture } = response.data
    const user = await userService.getUserByEmail(email)
    if (!user) {
      let user = await User.create({
        email: email,
        email_confirmed: 1,
        firstName: first_name,
        lastName: last_name,
        image: picture?.data?.url,
        created_date: Date.now(),
        created_ip: ip,
        password: null
      })
      return user.withoutPassword(user.id)
    }
    return user.withoutPassword(user.id)
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Facebook\'a kayıtlı böyle bir kullanıcı bulunmamaktadır!');
  }
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserByPk(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Lütfen giriş yapın');
  }
};

/**
 * Reset password
 * @param {string} userId
 * @param {string} newPassword
 * @returns {Promise}
 */
const updatePassword = async (userId, newPassword) => {
  try {
    const user = await userService.getUserByPk(userId);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Şifre yenileme başarısız oldu');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserByPk(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  updatePassword,
  verifyEmail,
  googleLogin,
  facebookLogin
};
