const keyGeneratorByParams = (req) => {
    var cacheKey = req.baseUrl;
    for (const [key, value] of Object.entries(req.params)) {
        cacheKey += `.${key}-{${value}}`
    }
    return cacheKey;
}

const keyGenerator = (req) => {
    return req.baseUrl + '.all';
}
const keyGeneratorByQuery = (req) => {
    var cacheKey = req.baseUrl;
    for (const [key, value] of Object.entries(req.query)) {
        cacheKey += `.${key}-{${value}}`
    }
    return cacheKey;
}
const keyGeneratorByBody = (req, userId) => {
    var cacheKey = req.baseUrl + req.url + '?key';
    if (userId) {
        cacheKey += `.userId-{${userId}}`
    }
    for (const [key, value] of Object.entries(req.body)) {
        cacheKey += `.${key}-{${value}}`
    }
    return cacheKey;
}
module.exports = {
    keyGenerator,
    keyGeneratorByParams,
    keyGeneratorByQuery,
    keyGeneratorByBody
}