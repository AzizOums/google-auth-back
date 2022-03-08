import { Router } from "express";

import authRouter from "./auth";

export default (): Router => {
  const router: Router = Router();
  router.use("/auth", authRouter());

  return router;
};
