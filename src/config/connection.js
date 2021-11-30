const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');


const { username, password, dbName, dialect, master_db, read_only_db,read_port,write_port } = config.env === 'development' ? config.mysql.development : config.mysql.production;


const db = new Sequelize(dbName, null, null, {
    dialect,
    operatorsAliases: Sequelize.Op,
    replication: {
        read: {
            host: read_only_db || localhost,
            port: read_port,
            username,
            password,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },
        write: {
            host: master_db || localhost,
            port: write_port,
            username,
            password,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },

    }
});

logger.info(`dbName1: "${dbName}"`)
logger.info(`masterdb: "${master_db}"`)
logger.info(`environment: "${process.env.READ_ONLY_DB}"`)
logger.info(`dbname2: "${config.mysql.production.read_only_db}"`)
logger.info(`config: "${config}"`)
logger.info(`env: "${config.env}"`)
logger.info(`env: "${process.env.MYSQL_ROOT_PASSWORD}"`)

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
