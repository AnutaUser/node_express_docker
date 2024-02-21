import { config } from 'dotenv';

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,

  FRONT_URL: process.env.FRONT_URL,

  BCRYPT_SALT: process.env.BCRYPT_SALT || 7,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'very_secret_access_key',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '3m',

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || 'very_secret_refresh_key',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  JWT_ACTIVATE_SECRET:
    process.env.JWT_ACTIVATE_SECRET || 'very_secret_activate_key',
  JWT_ACTIVATE_EXPIRES_IN: process.env.JWT_ACTIVATE_EXPIRES_IN || '1d',

  JWT_FORGOT_SECRET: process.env.JWT_FORGOT_SECRET || 'very_secret_forgot_key',
  JWT_FORGOT_EXPIRES_IN: process.env.JWT_FORGOT_EXPIRES_IN || '1d',

  NODEMAILER_USER: process.env.NODEMAILER_USER || '',
  NODEMAILER_PASS: process.env.NODEMAILER_PASS || '',

  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,

  AWS_S3_NAME: process.env.AWS_S3_NAME,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_ACL: process.env.AWS_S3_ACL,
  AWS_S3_URL: process.env.AWS_S3_URL,

  TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
};
