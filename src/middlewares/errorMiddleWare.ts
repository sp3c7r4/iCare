import type { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import Responses from "../utils/response.js";
import CustomError from "../utils/error.js";
import HttpStatus from "../utils/http.js";
import logTracker from "../utils/logTracker.js";
import errorHelper from "../utils/errorHelper.js";

const errorHandler = (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  logTracker.log('error', JSON.stringify(errorHelper.returnErrorLog(error)));
  if (error instanceof CustomError) {
    const { status, status_code, message } = error;
    const response = new Responses(status_code, status, message, {});
    res.status(status_code).send(response);
    next();
  } else {
    const response = new Responses(
      HttpStatus.INTERNAL_SERVER_ERROR.code,
      HttpStatus.INTERNAL_SERVER_ERROR.status,
      'Something went wrong',
      {}
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
  }
};

export default errorHandler;
