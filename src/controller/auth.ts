import { Request, Response, NextFunction } from "express";
import { google } from "googleapis";
import { store, cookie } from "../service/redis";

const Oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scope = [
  "https://www.googleapis.com/auth/userinfo.profile", // get user info
  "https://www.googleapis.com/auth/userinfo.email", // get user email ID and if its verified or not
];

const name = "sessionID";
let redirectUris = {} as any;

export const signin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionID } = req;
    const { from } = req.query;
    if (sessionID) if (from) redirectUris[sessionID] = from as string;
    const auth_url = Oauth2Client.generateAuthUrl({
      scope,
      prompt: "consent",
      state: "GOOGLE_LOGIN",
      access_type: "offline",
    });

    return res.status(302).redirect(auth_url);
  } catch (err) {
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionID } = req;
    const redirectUri = sessionID ? redirectUris[sessionID] : "";

    const { code } = req.query;
    const { tokens } = await Oauth2Client.getToken(code as string);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: tokens.access_token });
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    // @ts-ignore
    req.session.user = data;
    if (redirectUri) {
      delete redirectUris[sessionID];
      res.cookie(name, req.sessionID, cookie);
      return res.status(302).redirect(redirectUri);
    }
    return res.status(200).send(data);
  } catch (err) {
    return next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const { sessionid } = req.headers;
  if (sessionid) store.destroy(sessionid as string);
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie(name, cookie);
    return res.status(200).send({ message: "user logged out" });
  });
};

export const session = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session } = req;
    // @ts-ignore
    if (!session || !session.user) throw new Error("User unauthenticated");
    // @ts-ignore
    const { user } = session;
    return res.status(200).send(user);
  } catch (error: any) {
    return next({ status: 403, message: error?.message });
  }
};
