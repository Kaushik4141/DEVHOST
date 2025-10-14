const mongoose = require('mongoose');
const { env } = require('./env');

let isConnected = false;

async function connectDB() {
  if (isConnected) return mongoose.connection;
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: true,
  });
  isConnected = true;
  const conn = mongoose.connection;
  conn.on('error', (err) => {
    console.error('[mongo] connection error:', err.message);
  });
  conn.once('open', () => {
    console.log('[mongo] connected');
  });
  return conn;
}

module.exports = { connectDB };
