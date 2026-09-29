import type { Request, Response } from "express";
import { IUser, UserModel } from '../../DB/models/User.model'
import type { IsignupBodyInputsDTO } from "./auth.dto"
import { ConflictException } from "../../utils/responses/error.response";
import {UserRepo} from '../../DB/repositories/user.repository'

class AuthenticationService {
  private userModel = new UserRepo(UserModel);
  constructor() {}

  signup = async (req: Request, res: Response): Promise<Response> => {
    let { username, email, password }: IsignupBodyInputsDTO = req.body;
    const checkUserExist = await this.userModel.findOne({
      filter: { email },
      select: "email",
      options: {
        lean:true
      }
  
    })
    if (checkUserExist) {
      throw new ConflictException("email exist");
    }
    const user = await this.userModel.createUser({
        data: [{ username, email, password }],
        options: { validateBeforeSave: true },
      });
    return res.status(201).json({ message: "Done", data: user });
  };

  login = (req: Request, res: Response): Response => {
    return res.json({ message: "Done", data: req.body });
  };
}

export default new AuthenticationService();
