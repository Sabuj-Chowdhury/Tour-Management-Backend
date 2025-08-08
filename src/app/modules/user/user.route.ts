import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userZodSchema } from "./user.validation";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Role } from "./user.interface";
import { verifyTokenFn } from "../../utils/jwt";
import { envVariable } from "../../config/env";

export const userRouter = Router();

const checkAuth =
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
      );

      if (!verifyToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized!");
      }
      if ((verifyToken as JwtPayload).role !== Role.ADMIN) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are not permitted to view this Route!"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

userRouter.post(
  "/register",
  validateRequest(userZodSchema),
  userController.createUser
);
userRouter.get(
  "/all-users",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  userController.getAllUsers
);
