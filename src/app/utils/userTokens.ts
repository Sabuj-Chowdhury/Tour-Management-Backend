import { JwtPayload } from "jsonwebtoken";
import { envVariable } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyTokenFn } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userID: user._id,
    email: user.email,
    role: user.role,
  };
  //   jwt->json web token
  // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });
  const accessToken = generateToken(
    jwtPayload,
    envVariable.JWT_ACCESS_SECRET,
    envVariable.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVariable.JWT_REFRESH_SECRET,
    envVariable.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyTokenFn(
    refreshToken,
    envVariable.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Does not exist!");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}!`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted!");
  }

  const jwtPayload = {
    userID: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVariable.JWT_ACCESS_SECRET,
    envVariable.JWT_ACCESS_EXPIRES
  );
  return accessToken;
};
