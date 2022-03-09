import { Router } from "express";

import { signin, login, logout, session } from "../controller/auth";

export default (): Router => {
  const router: Router = Router();

  router.get("/google", signin);
  router.get("/login", login);
  router.get("/logout", logout);
  router.get("/session", session);

  return router;
};
