import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res
    .status(error?.status || 500)
    .json({ message: error?.message || "Internal server error" });
};

export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).send({ message: "Route not found" });
};

export const sessionHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<any> => {
  const { sessionid } = req.headers;

  const makeNew = (): any => {
    // @ts-ignore
    if (req.sessionStore) {
      // @ts-ignore
      req.sessionStore.get(sessionid, (err: any, sess: any) => {
        if (err) console.log(err);
        // @ts-ignore
        if (sess) req.sessionStore.createSession(req, sess);
        next();
      });
    } else {
      console.log("Redis sessionStore unavailable");
      next();
    }
  };

  if (sessionid) {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) console.log(err);
        makeNew();
      });
    } else makeNew();
  } else next();
};
