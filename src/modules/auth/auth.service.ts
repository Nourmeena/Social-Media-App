import type { Request, Response } from "express";
import { IUser, UserModel } from '../../DB/models/User.model'
import type { IsignupBodyInputsDTO } from "./auth.dto"
import {BadRequestException} from '../../utils/responses/error.response'
import {DatabaseRepository} from '../../DB/repositories/database.repository'

class AuthenticationService {
  private userModel=new DatabaseRepository<IUser>(UserModel)
  constructor() {}

  signup = async(req: Request, res: Response): Promise<Response> => {
    let { username, email, password }: IsignupBodyInputsDTO = req.body
    const [user] = (await this.userModel.create({data: [{ username, email, password }],options:{validateBeforeSave:true}}))||[]
    if (!user) {
      throw new BadRequestException('fail');
    }
    user.firstName = 'nourana'
    user.save()
    console.log({ username, email, password });
    //throw new ApplicationException("fail", 400);
    return res.status(201).json({ message: "Done", data: req.body });
  };

  login = (req: Request, res: Response): Response => {
    return res.json({ message: "Done", data: req.body });
  };
}

export default new AuthenticationService();
