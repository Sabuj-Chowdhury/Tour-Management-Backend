import { envVariable } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVariable.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super ADMIN already exist!");
      return;
    }

    console.log("Trying to create Super Admin .....");

    const hashedPassword = await bcryptjs.hash(
      envVariable.SUPER_ADMIN_PASSWORD,
      Number(envVariable.BCRYPT_SALT_ROUND)
    );
    const authsProvider: IAuthProvider = {
      provider: "credential",
      providerID: envVariable.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVariable.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authsProvider],
    };
    const superAdmin = await User.create(payload);
    console.log("Super Admin Created successfully! \n");
    console.log(superAdmin);
    return superAdmin;
  } catch (error) {
    console.log(error);
  }
};
