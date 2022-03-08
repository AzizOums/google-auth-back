import { Router } from "express";

import { signin, callbackURL } from "../controller/auth";

export default (): Router => {
  const router: Router = Router();

  router.get("/google", signin);
  router.get("/login", callbackURL);

  return router;
};
