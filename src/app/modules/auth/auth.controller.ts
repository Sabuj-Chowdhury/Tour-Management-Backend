/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookies } from "../../utils/setCookies";
import { createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVariable } from "../../config/env";
import passport from "passport";

const credentialLogin = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialLogin(req.body);
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        // return next(err);
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = createUserTokens(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...rest } = user.toObject();
      setAuthCookies(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged in Successfully!",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
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
    setAuthCookies(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New access token set successfully!",
      data: tokenInfo,
    });
  }
);

const logout = tryCatch(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged out Successfully!",
      data: null,
    });
  }
);

const resetPassword = tryCatch(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await authServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed Successfully!",
      data: null,
    });
  }
);

const googleCallBack = tryCatch(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
    }

    const tokenInfo = createUserTokens(user);

    setAuthCookies(res, tokenInfo);

    res.redirect(`${envVariable.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authController = {
  credentialLogin,
  newAccessToken,
  logout,
  resetPassword,
  googleCallBack,
};
