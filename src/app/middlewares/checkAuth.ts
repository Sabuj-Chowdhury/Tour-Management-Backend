import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { verifyTokenFn } from "../utils/jwt";
import { envVariable } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

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
      const isUserExist = await User.findOne({ email: verifyToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Does not exist!");
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}!`
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted!");
      }

      if (!authRoles.includes(verifyToken.role)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are not permitted to view this Route!"
        );
      }

      req.user = verifyToken;

      next();
    } catch (error) {
      next(error);
    }
  };
