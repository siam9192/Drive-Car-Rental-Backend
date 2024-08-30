import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  origin:process.env.ORIGIN,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_token_expire_time: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
  app_user_name: process.env.APP_USER_NAME,
  app_pass_key: process.env.APP_PASS_KEY,
  stripe_secret:process.env.STRIPE_SECRET,
  ssl_store_id : process.env.SSL_STORE_ID,
  ssl_store_password : process.env.SSL_STORE_PASSWORD,
  payment_success_url : process.env.PAYMENT_SUCCESS_URL,
  payment_cancel_url:process.env.PAYMENT_CANCEL_URL,
  payment_success_redirect_url : process.env.PAYMENT_SUCCESS_REDIRECT_URL,
};
