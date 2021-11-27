const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');


const { username, password, dbName, dialect, master_db, read_only_db } = config.env === 'development' ? config.mysql.development : config.mysql.production;


const db = new Sequelize(dbName, null, null, {
    dialect,
    operatorsAliases: Sequelize.Op,
    replication: {
        read: {
            host: read_only_db || master_db,
            username,
            password,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },
        write: {
            host: master_db || read_only_db,
            username,
            password,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },

    }
});





const initDb = async () => {
    try {
        const success = await db.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`)
        if (success) {
            logger.info(`Successfully connected to database: "${dbName}"`)
        }
    }
    catch (error) {
        logger.error(`DB Error: ${error}`)
    }
}

initDb();

module.exports = db;
