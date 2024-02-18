import Debug from "debug";
const debug = Debug("core:middlewares");
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "./errors";

export const checkRequestorNodeId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.get("X-REQ-NODE")) {
    next();
  } else {
    res.status(400).send("Requestor nodeID is not present");
  }
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404);
  return next(new NotFoundError(`${req.path} not found`));
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response => {
  let statusCode = res.statusCode || 500;
  if (statusCode === 200) statusCode = 500;
  res.status(statusCode);
  debug(`Error occured at route ${req.url} ${JSON.stringify(error.message)}`);
  return res.json({
    status: statusCode,
    result: null,
    error: error
  });
};
