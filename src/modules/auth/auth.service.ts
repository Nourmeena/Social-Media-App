import type { Request, Response } from "express";
import { UserModel } from '../../DB/models/User.model'
import type {
  IsignupBodyInputsDTO,
  IconfirmEmailBodyInputsDTO,
  ILognInBodyInputsDTO,
} from "./auth.dto";
import { ConflictException,NotFoundException } from "../../utils/responses/error.response";
import { UserRepo } from '../../DB/repositories/user.repository'
import { generateHash,compareHash } from '../../utils/security/hash.security'
import { emailEvent } from "../../utils/event/email.event";
import { createLoginCredentials } from "../../utils/security/token.security";
class AuthenticationService {
  private userModel = new UserRepo(UserModel);
  constructor() {}

  signup = async (req: Request, res: Response): Promise<Response> => {
    let { username, email, password }: IsignupBodyInputsDTO = req.body;
    const checkUserExist = await this.userModel.findOne({
      filter: { email },
      select: "email",
      options: {
        lean: true,
      },
    });
    if (checkUserExist) {
      throw new ConflictException("email exist");
    }
    const otp = 345686; /*generateOTP();*/
    const user = await this.userModel.createUser({
      data: [
        {
          username,
          email,
          password: await generateHash(password),
          confirmEmailOTP: await generateHash(String(otp)),
        },
      ],
      options: { validateBeforeSave: true },
    });
    emailEvent.emit("confirmEmail", { to: email, otp });
    return res.status(201).json({ message: "Done", data: user });
  };

  confirmEmail = async(req: Request, res: Response): Promise<Response> => {
    const { otp, email }: IconfirmEmailBodyInputsDTO = req.body
    const user = await this.userModel.findOne({
      filter: { email, confirmEmailOTP: { $exists: true }, confirmAt: { $exists: false } }
    });
    if (!user) {
      throw new NotFoundException("invalid account")
    }
    if (!(await compareHash(otp, user.confirmEmailOTP as string))) {
      throw new ConflictException("invalid confirmation code")
    }
    await this.userModel.updateOne({
      filter: { email },
      update: {
        confirmAt: new Date(),
        $unset:{confirmEmailOTP:1}
      }
    })
    return res.json({ message: "Done", data: req.body });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: ILognInBodyInputsDTO = req.body
    const user = await this.userModel.findOne({
      filter:{email}
    })
    if (!user) {
      throw new NotFoundException("invalid login info")
    }
    if (!(await compareHash(password, user.password))) {
      throw new NotFoundException("invalid login info")
    }
    const credentials = await createLoginCredentials(user)

    return res.json({ message: "Done", data: credentials});
  };
}

export default new AuthenticationService();
