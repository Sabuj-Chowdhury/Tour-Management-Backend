import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyTokenFn } from "../../utils/jwt";
import { envVariable } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User email doesn't exist!");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!");
  }
  const userTokens = createUserTokens(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
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
  return {
    accessToken,
  };
};

export const authServices = {
  credentialLogin,
  getNewAccessToken,
};
