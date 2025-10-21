/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStats from "http-status-codes";
import { userServices } from "./user.services";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { verifyTokenFn } from "../../utils/jwt";
import { envVariable } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";

// before using tryCatch util function

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     /*
//     ***this moved to the user Service layer
//     // const { name, email } = req.body;
//     // const user = await User.create({
//     //   name,
//     //   email,
//     // });
//     */

//     // this is where service layer is used
//     const user = await userServices.createUser(req.body);
//     res.status(httpStats.CREATED).json({
//       message: "User created successfully.",
//       user,
//     });
//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };

// after using tryCatch util function

const createUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IUser = {
      ...req.body,
      picture: req.file?.path,
    };

    const user = await userServices.createUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStats.CREATED,
      message: "User Created Successfully!",
      data: user,
    });
  }
);

const updateUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyTokenFn(
    //   token as string,
    //   envVariable.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const verifiedToken = req.user;
    const payload: IUser = {
      ...req.body,
      picture: req.file?.path,
    };
    const user = await userServices.updateUser(
      userID,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStats.OK,
      message: "User updated Successfully!",
      data: user,
    });
  }
);

const getAllUsers = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const users = await userServices.getAllUsers(
      query as Record<string, string>
    );

    // res.status(httpStats.OK).json({
    //   success: true,
    //   message: "All Users Retrieved Successfully!",
    //   data: users,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStats.OK,
      message: "All Users Retrieved Successfully!",
      meta: users.meta,
      data: users.data,
    });
  }
);

const getMe = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const users = await userServices.getMe(decodedToken.userID);

    // res.status(httpStats.OK).json({
    //   success: true,
    //   message: "All Users Retrieved Successfully!",
    //   data: users,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStats.OK,
      message: "Users Retrieved Successfully!",
      data: users.data,
    });
  }
);

const getSingleUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const user = await userServices.getSingleUser(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStats.OK,
      message: "Single user!",
      data: user.data,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
};
