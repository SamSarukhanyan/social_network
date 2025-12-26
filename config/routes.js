//congif>routes.js

import { accountRouter } from "@modules/account/account.router.js";
import { authRouter } from "@modules/auth/auth.router.js";

export default function (app) {
  app.use("/auth", authRouter);
  app.use("/account", accountRouter);
}
