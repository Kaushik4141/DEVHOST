class ApiResponse {
  constructor(status = 200, data = null, message = '') {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

module.exports = { ApiResponse };
