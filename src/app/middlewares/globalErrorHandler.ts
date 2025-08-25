/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVariable } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { IErrorSources } from "../interface/error.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // console.log({file :req.files});

  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );

    await Promise.all(
      imageUrls.map((imageUrl) => deleteImageFromCloudinary(imageUrl))
    );
  }

  let statusCode = 500;
  let message = `Something went wrong!!`;

  let errorSource: IErrorSources[] = [];

  // duplicate email -mongoose error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // ObjectID error / cast error -> mongoose
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // validation error ->mongoose
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSource = simplifiedError.errorSource as IErrorSources[];
    message = simplifiedError.message;
  }
  // zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource as IErrorSources[];
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
    err: envVariable.NODE_ENV === "development" ? err : null,
    stack: envVariable.NODE_ENV === "development" ? err.stack : null,
  });
};
