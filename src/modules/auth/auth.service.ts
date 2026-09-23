import type { Request, Response } from "express";
import { ApplicationException,BadRequestException } from "../../utils/responses/error.response";
import * as validators from './auth.validation'
import type {IsignupBodyInputsDTO} from "./auth.dto"

class AuthenticationService {
  constructor() {}

  signup = (req: Request, res: Response): Response => {
    const validationResult = validators.signup.body.safeParse(req.body)
    if (!validationResult.success) {
      const formattedIssues = validationResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw new BadRequestException("Validation Error", formattedIssues);
    }
    let { username, email, password }: IsignupBodyInputsDTO = req.body
    console.log({ username, email, password });
    //throw new ApplicationException("fail", 400);
    return res.status(201).json({ message: "Done", data: req.body });
  };

  login = (req: Request, res: Response): Response => {
    return res.json({ message: "Done", data: req.body });
  };
}

export default new AuthenticationService();
