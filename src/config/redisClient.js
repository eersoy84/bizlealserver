const logger = require('./logger')
var redis = require('redis');
const { REDIS_HOST, REDIS_PORT, MASTER_DB } = process.env
console.log("redis==>bol olmalı masterDB:", MASTER_DB)
console.log("redis=> dolu olmalı masterDB:", process.env.MASTER_DB)
const async = require('async')
const client = redis?.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
});

client?.on('connect', function () {
    logger.info(`Redis database connected\n`)
});


const isConnected = () => {
    if (client.connected) {
        return true
    }
    return false
}



// client.on('reconnecting', function () {
//     logger.info(`Redis client reconnecting '\n'`)
// });

// client.on('ready', function () {
//     logger.info(`Redis client is ready\n`)
// });

client?.on('error', function (err) {
    logger.error(`REDIS ERROR: ${err.message}`)
});

client?.on('end', function () {
    logger.info(`Redis client disconnected`)
    logger.info(`Redis server is going down now...`)
    // process.exit();
});

const set = (key, value, minutes) => {
    client?.set(key, value)
    if (minutes && minutes > 0)
        client.expire(key, 60 * minutes)

    return 'done';
}

const get = (key) => {
    return new Promise((resolve, reject) => {
        client?.get(key, function (error, result) {
            if (error) {
                reject(error)
            }
            resolve(result);
        });
    });
}
const deleteCache = (baseUrl) => {
    client?.del(baseUrl, function (error, result) {
        if (error) {
            reject(error)
        }
        resolve(result);
    });
}


const deleteWithPrefix = (key) => {
    client?.keys(key, function (err, rows) {
        if (!err) {
            async.each(rows, function (row, callbackDelete) {
                client.del(row, callbackDelete)
            })
        }
    });
}

// const close = () => {
//     client.quit();
// }

module.exports = { get, set, deleteCache, deleteWithPrefix, isConnected }