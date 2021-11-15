const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');


const { host, username, password, dbName, dialect } = config.env === 'development' ? config.mysql.development : config.mysql.production;
const db = new Sequelize(dbName, username, password, {
    host: host || 'localhost',
    dialect,
    operatorsAliases: Sequelize.Op,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
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
