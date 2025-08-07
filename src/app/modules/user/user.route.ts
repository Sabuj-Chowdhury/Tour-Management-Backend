import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userZodSchema } from "./user.validation";

export const userRouter = Router();

userRouter.post(
  "/register",
  validateRequest(userZodSchema),
  userController.createUser
);
userRouter.get("/all-users", userController.getAllUsers);
