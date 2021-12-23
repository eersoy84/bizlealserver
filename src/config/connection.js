const { Sequelize } = require('sequelize');
const logger = require('./logger');
const { MASTER_DB, READ_ONLY_DB, READ_PORT, WRITE_PORT } = process.env

const db = new Sequelize(process.env.DB_NAME, null, null, {
    dialect: process.env.DIALECT,
    operatorsAliases: Sequelize.Op,
    replication: {
        read: {
            host: READ_ONLY_DB,
            port: READ_PORT,
            username: process.env.USER,
            password: process.env.MYSQL_ROOT_PASSWORD,
            pool: {
                max: 90,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },
        write: {
            host: MASTER_DB,
            port: WRITE_PORT,
            username: process.env.USER,
            password: process.env.MYSQL_ROOT_PASSWORD,
            pool: {
                max: 30,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },

    }
});

const initDb = async () => {
    try {
        logger.info(`attemting to connect to "${process.env.DB_NAME}" database`)   
        const success = await db.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`)
        if (success) {
            logger.info(`Successfully connected to database: "${process.env.DB_NAME}"`)
        }
    }
    catch (error) {
        logger.error(`DB Error: ${error}`)
    }
}

initDb();



module.exports = db;
