/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { User } from "./user.model";
import httpStats from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
    });
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
