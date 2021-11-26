const ApiError = require('../utils/ApiError');
const redisClient = require('../config/redisClient')
const logger = require('../config/logger')
const httpStatus = require('http-status');
const { keyGeneratorByBody, keyGeneratorByQuery } = require('../config/cacheKeyGenerator')

const getCache = async (key) => {
  if (redisClient?.isConnected()) {
    return redisClient?.get(key)
      .then(res => res)
      .catch(err => {
        logger.error(err)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Rediste bir hata oluştu!')
      })
  }
}

const findCacheByBody = () => async (req, res, next) => {
  var userId = req.user?.id
  var key = keyGeneratorByBody(req, userId)
  var result = await getCache(key)
  if (result) return res.status(httpStatus.OK).send(JSON.parse(result));
  else return next()
}

const findCacheByQuery = () => async (req, res, next) => {
  var userId = req.user?.id
  var key = keyGeneratorByQuery(req, userId)
  var result = await getCache(key)
  if (result) return res.status(httpStatus.OK).send(JSON.parse(result));
  else return next()
}

module.exports = {
  findCacheByBody,
  findCacheByQuery
}
