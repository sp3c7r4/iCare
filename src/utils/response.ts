class Response {
  timeStamp: string;
  statusCode: number;
  httpStatus: string;
  message: string;
  data: string | object;
  
  constructor(statusCode: number, httpStatus: string, message: string, data: string | object) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }
}

export default Response;
