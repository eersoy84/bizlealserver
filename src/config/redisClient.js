const logger = require('./logger')
var redis = require('redis');
const { REDIS_HOST, REDIS_PORT } = process.env
const async = require('async');
const client = redis?.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
});
console.log(process.env.REDIS_HOST)
console.log(process.env.REDIS_PORT)

client?.on('connect', function () {
    logger.info(`Redis database connected\n`)
});

const isConnected = () => {
    if (client.connected) {
        return true
    }
    return false
}

client?.on('error', function (err) {
    // logger.error(`REDIS ERROR: ${err.message}`)
});

client?.on('end', function () {
    logger.info(`Redis client disconnected`)
});

const set = async (key, value, seconds) => {
    let result = new Promise((resolve, reject) => {
        client.set(key, value, (err, res) => {
            if (err) {
                logger.error(err)
                reject(err)
            }
            if (seconds && seconds > 0)
                client.expire(key, 60 * seconds)
            resolve(res);
        })
    })
    return result;
};

const get = async (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, res) => {
            if (err) {
                logger.error(err)
                reject(err)
            }
            resolve(res);
        })
    }
    )
};

const deleteCache = (baseUrl) => {
    client?.del(baseUrl, function (error, result) {
        if (error) {
            reject(error)
        }
        resolve(result);
    });
}


const deleteWithPrefix = (key) => {
    return new Promise(resolve => {
        client?.keys(key, function (err, rows) {
            if (!err) {
                async.each(rows, function (row, callbackDelete) {
                    client.del(row, callbackDelete)
                })
            }
        });
        resolve()
    })
}

// const close = () => {
//     client.quit();
// }

module.exports = { get, set, deleteCache, deleteWithPrefix, isConnected }