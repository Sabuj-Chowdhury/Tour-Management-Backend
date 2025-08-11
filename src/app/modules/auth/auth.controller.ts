import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

const credentialLogin = tryCatch(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialLogin(req.body);

    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });

    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully!",
      data: loginInfo,
    });
  }
);

const newAccessToken = tryCatch(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Invalid or no refresh token!"
      );
    }
    const tokenInfo = await authServices.getNewAccessToken(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New access token set successfully!",
      data: tokenInfo,
    });
  }
);

export const authController = {
  credentialLogin,
  newAccessToken,
};
