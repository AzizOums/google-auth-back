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
    return res.redirect(auth_url);
  } catch (err) {
    next(err);
  }
};

export const callbackURL = async (
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
    if (from) {
      const url = `${from}?user=${JSON.stringify(data)}`;
      from = "";
      return res.redirect(url);
    }
    return res.status(200).send(data);
  } catch (err) {
    return next(err);
  }
};
