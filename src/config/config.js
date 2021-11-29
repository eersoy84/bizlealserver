const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    DATABASE: Joi.string().valid('mysql', 'postgre', 'mongodb'),
    DB_HOST: Joi.string(),
    MYSQL_HOST: Joi.string(),
    MASTER_DB: Joi.string(),
    READ_ONLY_DB: Joi.string(),
    READ_PORT: Joi.string(),
    WRITE_PORT: Joi.string(),
    USER: Joi.string(),
    PASSWORD: Joi.string(),
    MYSQL_ROOT_PASSWORD: Joi.string(),
    MYSQL_DATABASE: Joi.string(),
    DIALECT: Joi.string(),
    DB_PORT: Joi.number(),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  db: envVars.DATABASE,
  port: envVars.PORT,
  mysql: {
    development: {
      username: envVars.USER,
      password: envVars.PASSWORD || '',
      dbName: envVars.MYSQL_DATABASE,
      master_db: envVars.MASTER_DB,
      read_only_db: envVars.READ_ONLY_DB,
      read_port: envVars.READ_PORT,
      write_port: envVars.WRITE_PORT,
      dialect: envVars.DIALECT,
      port: envVars.DB_PORT
    },
    production: {
      username: envVars.USER,
      password: envVars.MYSQL_ROOT_PASSWORD ,
      dbName: envVars.MYSQL_DATABASE,
      master_db: envVars.MASTER_DB,
      read_only_db: envVars.READ_ONLY_DB,
      read_port: envVars.READ_PORT,
      write_port: envVars.WRITE_PORT,
      dialect: envVars.DIALECT,
      port: envVars.DB_PORT
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
