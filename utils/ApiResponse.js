class ApiResponse {
  constructor(success, statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }
}
export { ApiResponse };
