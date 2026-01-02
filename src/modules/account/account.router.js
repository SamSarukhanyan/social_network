import express from "express";
import { isAuthenticated } from "@modules/account/middlewares/isAuthenticate.js";
import { AccountService } from "@modules/account/account.service.js";
import db from "@db/index.js";
import { AccountController } from "@modules/account/account.controller.js";
import { asyncHandler } from "@middlewares/async.Handler.js";

export const accountRouter = express.Router();

const accountService = new AccountService(db.User, db.Follow, db.Post);
const accountController = new AccountController(accountService);

accountRouter.use(asyncHandler(isAuthenticated));

accountRouter.get(
  "/search/:text",
  asyncHandler(accountController.search.bind(accountController))
);

accountRouter.get(
  "/followers",
  asyncHandler(accountController.getFollowers.bind(accountController))
);
accountRouter.get(
  "/followings",
  asyncHandler(accountController.getFollowings.bind(accountController))
);
accountRouter.get(
  "/requests",
  asyncHandler(accountController.requests.bind(accountController))
);
accountRouter.patch(
  "/request/:id/accept",
  asyncHandler(accountController.acceptFollow.bind(accountController))
);
accountRouter.patch(
  "/request/:id/decline",
  asyncHandler(accountController.declineFollow.bind(accountController))
);
accountRouter.post(
  "/:id/follow",
  asyncHandler(accountController.follow.bind(accountController))
);
accountRouter.get(
  "/:id",
  asyncHandler(accountController.getById.bind(accountController))
);
