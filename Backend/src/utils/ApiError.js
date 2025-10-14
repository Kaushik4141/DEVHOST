class ApiError extends Error {
  constructor(status = 500, message = 'Server error') {
    super(message);
    this.status = status;
  }
}

module.exports = { ApiError };
