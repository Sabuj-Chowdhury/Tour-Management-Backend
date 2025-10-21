import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVariable } from "../../config/env";

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
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userID);

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "old Password does not match!");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVariable.BCRYPT_SALT_ROUND)
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.save();
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userID);

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "old Password does not match!");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVariable.BCRYPT_SALT_ROUND)
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.save();
};

const setPassword = async (userID: string, plainPassword: string) => {
  const user = await User.findById(userID);

  if (!user) {
    throw new AppError(404, "user not found!");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "already have password, to change password use change password api"
    );
  }

  const hashedPassword = await bcrypt.hash(
    plainPassword,
    Number(envVariable.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credential",
    providerID: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
};

export const authServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
};
