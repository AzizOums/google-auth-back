import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import session from "express-session";

import passport from "passport";

import routes from "./routes";
import { notFound, errorHandling } from "./middlewares";

const app: Application = express();

const init = () => {
  app.use(cors());
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", routes());

  //Define the Login Route
  // app.get("/login", (req: Request, res: Response) => {
  //   res.sendFile(path.join(__dirname + "/view/login.html"));
  // });

  //Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
  // app.get(
  //   "/api/user",
  //   checkAuthenticated,
  //   (req: Request, res: Response, _next: NextFunction) => {
  //     return res.send(req?.user);
  //   }
  // );

  app.use(notFound);
  app.use(errorHandling);

  // const authUser = (
  //   _request: any,
  //   _accessToken: any,
  //   _refreshToken: any,
  //   profile: any,
  //   done: any
  // ) => {
  //   const {
  //     given_name: firstName,
  //     family_name: name,
  //     email,
  //     picture,
  //   } = profile;
  //   return done(null, { firstName, name, email, picture });
  // };

  // //Use "GoogleStrategy" as the Authentication Strategy
  // passport.use(
  //   new Strategy(
  //     {
  //       clientID: process.env.GOOGLE_CLIENT_ID as string,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //       callbackURL: process.env.REDIRECT_URI as string,
  //       passReqToCallback: true,
  //     },
  //     authUser
  //   )
  // );

  // passport.serializeUser((user: any, done: any) => {
  //   // The USER object is the "authenticated user" from the done() in authUser function.
  //   // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.
  //   done(null, user);
  // });

  // passport.deserializeUser((user: any, done: any) => {
  //   // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
  //   // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
  //   done(null, user);
  // });

  // app.get(
  //   "/api/auth/google",
  //   passport.authenticate("google", { scope: ["email", "profile"] })
  // );

  // app.get(
  //   "/api/auth/login",
  //   passport.authenticate("google", {
  //     successRedirect: "/api/user",
  //     failureRedirect: "/login",
  //   })
  // );

  //Use the req.isAuthenticated() function to check if user is Authenticated
  // const checkAuthenticated = (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }
  //   // res.redirect("/login");
  //   return res.status(401).send({ message: "User not authenticated" });
  // };

  //Define the Logout
  // app.get("/logout", (req, res) => {
  //   req.logOut();
  //   res.redirect("/login");
  //   console.log(`-------> User Logged out`);
  // });
};

init();
export default app;
