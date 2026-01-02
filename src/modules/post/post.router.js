//post.router.js
import express from "express";
import db from "@db/index.js";
import { PostService } from "./post.service.js";
import { PostController } from "./post.controller.js";
import { isAuthenticated } from "./middlewares/isAuthenticate.js";
import { multerErrorHandler } from "./middlewares/multerError.middleware.js";
import upload from "./middlewares/multer.js";
import { asyncHandler } from "@middlewares/async.Handler.js";

const postService = new PostService(
  db.Post,
  db.User,
  db.PostImage,
  db.sequelize
);
const postController = new PostController(postService);

export const postRouter = express.Router();

postRouter.use(isAuthenticated);

postRouter.get("/", asyncHandler(postController.getPosts.bind(postController)));
postRouter.post(
  "/",
  upload,
  asyncHandler(postController.createPost.bind(postController))
);
postRouter.get(
  "/:id",
  asyncHandler(postController.getPostById.bind(postController))
);

postRouter.use(multerErrorHandler);
