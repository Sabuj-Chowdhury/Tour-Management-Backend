import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVariable } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userConstants } from "./user.constants";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already Exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVariable.BCRYPT_SALT_ROUND)
  );

  const authsProvider: IAuthProvider = {
    provider: "credential",
    providerID: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authsProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userID: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /**
   * email -> can't be updated
   * name,phone, password, address
   * password -> re-hashing
   * only ADMIN or SUPER_ADMIN can update role and isDeleted
   */

  const isUserExist = await User.findById(userID);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized!");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized!");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized!");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVariable.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userID, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.picture && isUserExist.picture) {
    await deleteImageFromCloudinary(isUserExist.picture);
  }

  return updatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const userData = queryBuilder
    .filter()
    .search(userConstants)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    userData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");

  return {
    data: user,
  };
};

const getMe = async (id: string) => {
  const user = await User.findById(id).select("-password");

  return {
    data: user,
  };
};

export const userServices = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
};
