import { Request, Response, NextFunction } from "express";
import { google } from "googleapis";

const Oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scope = [
  "https://www.googleapis.com/auth/userinfo.profile", // get user info
  "https://www.googleapis.com/auth/userinfo.email", // get user email ID and if its verified or not
];

let from = "";

export const signin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query?.from) from = req.query?.from as string;
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
    if (from) {
      const url = `${from}?sID=${req.sessionID}`;
      from = "";
      return res.status(302).redirect(url);
    }
    return res.status(200).send(data);
  } catch (err) {
    return next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) return next(err);
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
