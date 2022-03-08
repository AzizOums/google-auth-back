import { Router } from "express";
import passport from "passport";

import {
  loginSuccess,
  loginFailure,
  logout,
} from "../controller/auth.controller";

export default (): Router => {
  const router: Router = Router();

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  router.get(
    "/login",
    passport.authenticate("google", {
      // successRedirect: "/api/auth/success",
      failureRedirect: "/api/auth/failure",
    }),
    async (req, res, next) => {
      const user = JSON.stringify(req.user);
      res.redirect(
        `${req?.query?.urlR || "http://localhost:3000"}?user=${user}`
      );
    }
  );
  router.get("/success", loginSuccess);
  router.get("/failure", loginFailure);
  router.get("/logout", logout);

  return router;
};

// const { OAuth2Client } = require("google-auth-library");

// const client_id = process.env.GOOGLE_CLIENT_ID;
// const client_secret = process.env.GOOGLE_CLIENT_SECRET;
// const redirect_uri = process.env.REDIRECT_URI;

// const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);

// const authorizeUrl = oAuth2Client.generateAuthUrl({
//   access_type: "offline",
//   scope: "https://www.googleapis.com/auth/userinfo.profile",
// });

// const signInWithGoogle = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     return res.redirect(301, authorizeUrl);
//   } catch (err) {
//     next(err);
//   }
// };

// const test = async (_req: Request, res: Response, _next: NextFunction) => {
//   try {
//     const tokenInfo = await oAuth2Client.getTokenInfo(
//       oAuth2Client.credentials.access_token
//     );
//     return res.status(200).send(tokenInfo);
//   } catch (e) {
//     console.log(e);
//     return _next(e);
//   }
// };

// const login = async (req: Request, res: Response, _next: NextFunction) => {
//   const { code } = req.query;
//   const r = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(r.tokens);
//   res.send(r);
// };
