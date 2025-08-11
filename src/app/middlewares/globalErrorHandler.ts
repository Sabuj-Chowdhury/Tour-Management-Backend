/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVariable } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong!!`;

  const errorSource: any = [
    /**
     *{
     * path :
     * message:
     * }
     */
  ];

  // duplicate email -mongoose error
  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchedArray[1]} already exist!`;
  }
  // ObjectID error / cast error -> mongoose
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid mongoose ObjectID, please provide a valid ObjectID!`;
  }
  // validation error ->mongoose
  else if (err.name === "ValidationError") {
    statusCode = 400;

    const errors = Object.values(err.errors);

    errors.forEach((errorObject: any) =>
      errorSource.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );

    message = "Validation error!";
  }
  // zod error
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Zod error";
    err.issues.forEach((issue: any) => {
      errorSource.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      });
    });
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: envVariable.NODE_ENV === "development" ? err.stack : null,
  });
};
