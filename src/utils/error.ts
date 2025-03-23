export default class CustomError extends Error {
  status: string
  status_code: number
  
  constructor(message: string, status_code: number, status: string) {
    super(message);
    this.status = status;
    this.status_code = status_code;
    this.name = this.constructor.name; //
  }
}
