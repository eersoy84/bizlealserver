const ApiError = require('../utils/ApiError');
const redisClient = require('../config/redisClient')
const logger = require('../config/logger')
const httpStatus = require('http-status');
const { keyGeneratorByParams, keyGenerator } = require('../config/cacheDefaults')


const findCacheAll = (fn) => async (req, res, next) => {
  var key = keyGenerator(req)
  var result = await getCache(key)
  if (result) return res.status(httpStatus.OK).send(JSON.parse(result));
  else return next()
}

const getCache = async (key) => {
  return redisClient.get(key)
    .then(res => res)
    .catch(err => {
      logger.error(err)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Rediste bir hata oluştu!')
    })
}


const findCacheByParams = () => async (req, res, next) => {
  var key = keyGeneratorByParams(req)
  var result = await getCache(key)
  if (result) return res.status(httpStatus.OK).send(JSON.parse(result));
  else return next()
}

module.exports = {
  findCacheAll,
  findCacheByParams
}
