//social_network_backend/src/index.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "@db/index.js";
import loadRoutes from "@config/routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "@middlewares/error.middleware.js";
import { multerErrorHandler } from "@modules/post/middlewares/multerError.middleware.js";
import { resetPosts } from "./scripts/resetPosts.js";
import { corsOptions } from "./utils/corsOptions.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// CORS configuration - Allow frontend origin
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
// Serve static files from uploads directory
// This allows images to be accessed at: http://localhost:5000/uploads/posts/image.jpg
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

loadRoutes(app);
app.use(multerErrorHandler);
app.use(errorMiddleware);
fs.mkdirSync("uploads/posts", { recursive: true });
fs.mkdirSync("uploads/avatars", { recursive: true });
//await resetPosts(db.sequelize, db.Post, db.PostImage, db.Like);
db.sequelize.sync().then(() => console.log("SYNC"));

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL}`);
});
