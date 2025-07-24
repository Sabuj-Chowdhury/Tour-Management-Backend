import { Router } from "express";
import { userController } from "./user.controller";

export const userRouter = Router();

userRouter.post("/register", userController.createUser);
userRouter.get("/all-users", userController.getAllUsers);
