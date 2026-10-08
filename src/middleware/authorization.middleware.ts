import type { NextFunction, Request, Response } from "express";
import { decodeToken } from "../utils/security/token.security";
import { BadRequestException } from "../utils/responses/error.response";


export const authentication = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      throw new BadRequestException("validation error", {
        key: "headers",
        issues: [
          {
            path: "authorization",
            message: "miss authorization",
          },
        ],
      });
    }

    const { decoded, user } = await decodeToken({
      authorization: req.headers.authorization,
    });
    req.user = user;
    req.decoded = decoded;
    next();
  };
};
