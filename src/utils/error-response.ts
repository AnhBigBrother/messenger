class ErrorResponse {
  status: number;
  message: string;
  constructor(status: number, message: string, issues?: object) {
    this.message = message;
    this.status = status;
  }
}

export { ErrorResponse };
