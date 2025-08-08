import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "jsonwebtoken";

import httpStatus from "http-status-codes";

import AppError from "../errorHelpers/AppError";
import { verifyTokenFn } from "../utils/jwt";
import { envVariable } from "../config/env";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No token Received!");
      }

      // const verifyToken = jwt.verify(accessToken, "secret");
      const verifyToken = verifyTokenFn(
        accessToken,
        envVariable.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!verifyToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized!");
      }
      if (!authRoles.includes(verifyToken.role)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are not permitted to view this Route!"
        );
      }
      // if ((verifyToken as JwtPayload).role !== Role.ADMIN) {
      //   throw new AppError(
      //     httpStatus.BAD_REQUEST,
      //     "You are not permitted to view this Route!"
      //   );
      // }

      next();
    } catch (error) {
      next(error);
    }
  };
