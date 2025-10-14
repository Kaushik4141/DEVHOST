require('dotenv').config();

const required = (name) => {
  const value = process.env[name];
  if (typeof value === 'undefined' || value === '') {
    console.warn(`[env] Missing ${name}. Populate it in your .env file.`);
  }
  return value;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  MONGODB_URI: required('MONGODB_URI') || 'mongodb://127.0.0.1:27017/lernflow',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  CLERK_PUBLISHABLE_KEY: required('CLERK_PUBLISHABLE_KEY') || '',
  CLERK_SECRET_KEY: required('CLERK_SECRET_KEY') || '',
  CLERK_SIGN_IN_URL: process.env.CLERK_SIGN_IN_URL || '',
  LIBRARIES_IO_API_KEY: required('LIBRARIES_IO_API_KEY') || '',
};

module.exports = { env };
