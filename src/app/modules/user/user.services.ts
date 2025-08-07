import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";

const createUser = async (payload: Partial<IUser>) => {
  // const { name, email } = payload;
  const { email, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already Exists");
  }

  const authsProvider: IAuthProvider = {
    provider: "credential",
    providerID: email as string,
  };

  const user = await User.create({
    email,
    auths: [authsProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  const totalUser = await User.countDocuments();
  return {
    users,
    meta: {
      total: totalUser,
    },
  };
};

export const userServices = {
  createUser,
  getAllUsers,
};
