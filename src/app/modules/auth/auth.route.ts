import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

export const authRouter = Router();

authRouter.post("/login", authController.credentialLogin);
authRouter.post("/refresh-token", authController.newAccessToken);
authRouter.post("/logout", authController.logout);
authRouter.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authController.resetPassword
);
authRouter.get(
  "/google",

  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallBack
);
