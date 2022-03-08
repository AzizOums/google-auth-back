import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-google-oauth2";

const authUser = (
  _request: any,
  _accessToken: any,
  _refreshToken: any,
  profile: any,
  done: any
) => {
  const { given_name: firstName, family_name: name, email, picture } = profile;
  return done(null, { firstName, name, email, picture });
};

//Use "GoogleStrategy" as the Authentication Strategy
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.REDIRECT_URI as string,
      passReqToCallback: true,
    },
    authUser
  )
);

passport.serializeUser((user: any, done: any) => {
  // The USER object is the "authenticated user" from the done() in authUser function.
  // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
  // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
  done(null, user);
});

//Use the req.isAuthenticated() function to check if user is Authenticated
export const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return next({ status: 401, message: "User not authenticated" });
};

export const loginSuccess = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(200).send(req.user);
};

export const loginFailure = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next({ status: 401, message: "User not authenticated" });
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut();
  res.status(200).send({ message: "user loged out" });
};
