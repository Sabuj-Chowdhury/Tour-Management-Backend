/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVariable } from "../config/env";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = 500;
  const message = `Something went wrong!! ${err.message}`;

  res.status(statusCode).json({
    success: false,
    message,
    err,
    stack: envVariable.NODE_ENV === "development" ? err.stack : null,
  });
};
