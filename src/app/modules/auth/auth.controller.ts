import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";

const credentialLogin = tryCatch(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully!",
      data: loginInfo,
    });
  }
);

export const authController = {
  credentialLogin,
};
