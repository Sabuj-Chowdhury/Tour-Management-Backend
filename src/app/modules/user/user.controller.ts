/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStats from "http-status-codes";
import { userServices } from "./user.services";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { verifyTokenFn } from "../../utils/jwt";
import { envVariable } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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
    const user = await userServices.createUser(req.body);

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
    const token = req.headers.authorization;
    const verifiedToken = verifyTokenFn(
      token as string,
      envVariable.JWT_ACCESS_SECRET
    ) as JwtPayload;
    const payload = req.body;
    const user = await userServices.updateUser(userID, payload, verifiedToken);

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
    const users = await userServices.getAllUsers();

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
      data: users.users,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
};
