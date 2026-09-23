import type { Request, Response } from "express";
import type {IsignupBodyInputsDTO} from "./auth.dto"

class AuthenticationService {
  constructor() {}

  signup = (req: Request, res: Response): Response => {
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
