/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

import httpStats from "http-status-codes";
import { userServices } from "./user.services";

const createUser = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.log(error);
    res.status(httpStats.BAD_REQUEST).json({
      message: `Something went wrong!! ${error.message}`,
      error,
    });
  }
};

export const userController = {
  createUser,
};
