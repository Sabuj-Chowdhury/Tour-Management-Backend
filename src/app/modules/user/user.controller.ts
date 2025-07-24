import { NextFunction, Request, Response } from "express";

import httpStats from "http-status-codes";
import { userServices } from "./user.services";
import tryCatch from "../../utils/tryCatch";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);

    res.status(httpStats.CREATED).json({
      success: true,
      message: "User Created Successfully!",
      user,
    });
  }
);

export const userController = {
  createUser,
};
