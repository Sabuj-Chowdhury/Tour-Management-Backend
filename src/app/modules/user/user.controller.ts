/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStats from "http-status-codes";
import { userServices } from "./user.services";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /*
    ***this moved to the user Service layer
    // const { name, email } = req.body;
    // const user = await User.create({
    //   name,
    //   email,
    // });
    */

    // this is where service layer is used
    const user = await userServices.createUser(req.body);
    res.status(httpStats.CREATED).json({
      message: "User created successfully.",
      user,
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const userController = {
  createUser,
};
