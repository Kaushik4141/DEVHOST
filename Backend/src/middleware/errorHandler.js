const { ApiError } = require('../utils/ApiError');

module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err?.status || 500;
  const message = err?.message || 'Server error';
  if (status >= 500) {
    console.error('[error]', err);
  } else {
    console.warn('[warn]', message);
  }
  res.status(status).json({ error: message });
};
