import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

export const userRouter = Router();

userRouter.post(
  "/register",
  validateRequest(userZodSchema),
  userController.createUser
);
userRouter.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);
userRouter.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userController.updateUser
);
