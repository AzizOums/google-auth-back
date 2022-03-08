import { NextFunction, Request, Response } from "express";

export const errorHandling = (
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
