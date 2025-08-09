import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";

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

  // const jwtPayload = {
  //   userID: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };
  // //   jwt->json web token
  // // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });
  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVariable.JWT_ACCESS_SECRET,
  //   envVariable.JWT_ACCESS_EXPIRES
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVariable.JWT_REFRESH_SECRET,
  //   envVariable.JWT_REFRESH_EXPIRES
  // );

  const userTokens = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

export const authServices = {
  credentialLogin,
};
