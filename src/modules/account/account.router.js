import express from "express";
import { isAuthenticated } from "@modules/account/middlewares/isAuthenticate.js";
import { AccountService } from "@modules/account/account.service.js";
import db from "@db/index.js";
import { AccountController } from "@modules/account/account.controller.js";

export const accountRouter = express.Router();

const accountService = new AccountService(db.User, db.Follow, db.Post);
const accountController = new AccountController(accountService);

accountRouter.use(isAuthenticated);

accountRouter.get(
  "/search/:text",
  accountController.search.bind(accountController)
);
accountRouter.get("/:id", accountController.getById.bind(accountController));
