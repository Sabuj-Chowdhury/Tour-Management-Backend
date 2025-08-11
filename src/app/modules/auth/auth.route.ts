import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const authRouter = Router();

authRouter.post("/login", authController.credentialLogin);
authRouter.post("/refresh-token", authController.newAccessToken);
authRouter.post("/logout", authController.logout);
authRouter.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authController.resetPassword
);
