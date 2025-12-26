//index.js
import express from "express";
import db from "@db/index.js";
import loadRoutes from "@config/routes.js";
import dotenv from "dotenv";
import { errorMiddleware } from "@middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());

loadRoutes(app);

app.use(errorMiddleware);

db.sequelize.sync({ alter: true }).then(() => console.log("SYNC"));

const PORT = process.env.APP_PORT;

app.listen(PORT, () => console.log(`http://localhost:'${PORT}'`));
