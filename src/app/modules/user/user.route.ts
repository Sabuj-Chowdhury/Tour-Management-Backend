import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema, userZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

export const userRouter = Router();

userRouter.post(
  "/register",
  multerUpload.single("file"),
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
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  userController.updateUser
);

userRouter.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  userController.getSingleUser
);
