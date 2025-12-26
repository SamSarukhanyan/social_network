//auth.router.js
import express from "express";
import { AuthController } from "@modules/auth/auth.controller.js";
import { AuthService } from "@modules/auth/auth.service.js";
import { signupValidator } from "@modules/auth/validators/signup.validator.js";
import db from "@db/index.js";
import { passwordHash } from "@modules/auth/middlewares/passwordPipe.js";
import { loginValidator } from "@modules/auth/validators/login.validator.js";
import { isAuthenticated } from "@modules/auth/middlewares/isAuthenticate.js";
import { changeUsernameValidator } from "@modules/auth/validators/changeUsername.validator.js";

export const authRouter = express.Router();

const authService = new AuthService(db.User);
const authController = new AuthController(authService);

authRouter.post(
  "/signup",
  [signupValidator.bind(null, authService), passwordHash],
  authController.signup.bind(authController)
);
authRouter.post(
  "/login",
  [loginValidator.bind(null, authService)],
  authController.login.bind(authController)
);
authRouter.use(isAuthenticated);
authRouter.get("/user", authController.getAuthUser.bind(authController));
authRouter.patch(
  "/user/username",
  changeUsernameValidator,
  authController.changeUsername.bind(authController)
);
authRouter.patch(
  "/user/privacy",
  authController.changePrivacy.bind(authController)
);
