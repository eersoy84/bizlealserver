const setParams = (cacheKey, query) => {
    for (const [key, value] of Object.entries(query)) {
        cacheKey += `.${key}-{${value}}`
    }
    return cacheKey
}

const keyGeneratorByQuery = (req, userId) => {
    let cacheKey = req.baseUrl;
    if (userId) {
        cacheKey += `.userId-{${userId}}`
    }
    return setParams(cacheKey, req.query)
}


const keyGeneratorByBody = (req, userId) => {
    var cacheKey = req.baseUrl + req.url;
    if (userId) {
        cacheKey += `.userId-{${userId}}`
    }
    return setParams(cacheKey, req.body)

}
const getPrefixWithoutUrl = (req, userId) => {
    var prefix = req.baseUrl + '*';
    if (userId) {
        prefix += `.userId-{${userId}}*`
    }
    return prefix;
}
const getPrefix = (req, userId) => {
    var prefix = req.baseUrl + req.url + '*';
    if (userId) {
        prefix += `.userId-{${userId}}*`
    }
    console.log("prefix", req.baseUrl, req.url)
    return prefix;
}
const getCustomPrefix = (baseUrl, path, userId) => {
    var prefix = baseUrl + path + '*';
    if (userId) {
        prefix += `.userId-{${userId}}*`
    }
    console.log("prefix", prefix)
    return prefix;
}


module.exports = {
    keyGeneratorByQuery,
    keyGeneratorByBody,
    getPrefix,
    getPrefixWithoutUrl,
    getCustomPrefix
}