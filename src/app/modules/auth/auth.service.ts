import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  const jwtPayload = {
    userID: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  //   jwt->json web token
  const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });

  return {
    accessToken,
  };
};

export const authServices = {
  credentialLogin,
};
