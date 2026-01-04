//index.js
import express from "express";
import fs from "fs";
import db from "@db/index.js";
import loadRoutes from "@config/routes.js";
import dotenv from "dotenv";
import { errorMiddleware } from "@middlewares/error.middleware.js";
import { multerErrorHandler } from "@modules/post/middlewares/multerError.middleware.js";
import { resetPosts } from "./scripts/resetPosts.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());

loadRoutes(app);
app.use(multerErrorHandler);
app.use(errorMiddleware);
fs.mkdirSync("uploads/posts", { recursive: true });
//await resetPosts(db.sequelize, db.Post, db.PostImage, db.Like);
db.sequelize.sync().then(() => console.log("SYNC"));

const PORT = process.env.APP_PORT;

app.listen(PORT, () => console.log(`http://localhost:'${PORT}'`));
