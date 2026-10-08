import { sign,verify } from 'jsonwebtoken'
import type { Secret, SignOptions,JwtPayload } from 'jsonwebtoken'
import { RoleEnum, HUserDocument } from '../../DB/models/User.model'
import { UserRepo } from '../../DB/repositories/user.repository'
import { UserModel } from '../../DB/models/User.model'
import { UnauthorizedException,BadRequestException } from "../../utils/responses/error.response";

export enum SignatureLevelEnum{
  Bearer="bearer",
  System='system'
}

export enum TokenEnum{
  access = "access",
  refresh="refresh"
}

export const generateToken = async ({
  payload,
  secret = process.env.ACCESS_USER_TOKEN_SIGN as string,
  options = { expiresIn: Number(process.env.TOKEN_EXPIRES_IN) },
}: {
        payload: object; secret?: Secret;options?:SignOptions 
    }):Promise<string> => {
    return sign(payload,secret,options)
};


export const detectSignatureLevel = async (role: RoleEnum=RoleEnum.user): Promise<SignatureLevelEnum>=>{
  let signatureLevel: SignatureLevelEnum = SignatureLevelEnum.Bearer
  switch (role) {
    case RoleEnum.admin:
      signatureLevel = SignatureLevelEnum.System
      break
    default:
      signatureLevel = SignatureLevelEnum.Bearer;
      break
  }
  return signatureLevel;
}

export const getSignature = async (signatureLevel: SignatureLevelEnum = SignatureLevelEnum.Bearer): Promise<{ access_signature: string; refresh_signature: string }> => {
  let signature: { access_signature: string; refresh_signature: string } = {
    access_signature: " ",
    refresh_signature: " "
  }

  switch (signatureLevel) {
    case SignatureLevelEnum.System:
      signature.access_signature = process.env.ACCESS_ADMIN_TOKEN_SIGN as string;
      signature.refresh_signature = process.env.ACCESS_ADMIN_REFRESH_TOKEN_SIGN as string
      break
    default:
      signature.access_signature = process.env.ACCESS_USER_TOKEN_SIGN as string;
      signature.refresh_signature = process.env.ACCESS_USER_REFRESH_TOKEN_SIGN as string

  }
  return signature
}
export const createLoginCredentials = async (user: HUserDocument) => {
  let signatureLevel = await detectSignatureLevel(user.role)
  let signatures = await getSignature(signatureLevel)

  const access_token = await generateToken({
    payload: { _id: user._id },
    secret: signatures.access_signature,
    options: { expiresIn: Number(process.env.TOKEN_EXPIRES_IN) },
  });

  const refresh_token = await generateToken({
    payload: { _id: user._id },
    secret: signatures.refresh_signature,
    options: { expiresIn: Number(process.env.TOKEN_EXPIRES_IN) },
  });

  return {access_token,refresh_token}
}

export const verifyToken = async({ token, secret=process.env.ACCESS_USER_TOKEN_SIGN as string }: {
  token: string;
  secret?:Secret
}):Promise<JwtPayload>=>{
  return verify(token,secret) as JwtPayload
}

export const decodeToken = async ({ authorization, tokenType = TokenEnum.access }: {
  authorization: string;
  tokenType?: TokenEnum
}) => {
  const userModel = new UserRepo(UserModel)
  const [bearerKey, token] = authorization.split(" ")
  if (!bearerKey || !token) {
    throw new UnauthorizedException("missing token parts");
  }
  const signature = await getSignature(bearerKey as SignatureLevelEnum);

  const decoded = await verifyToken({ token, secret: tokenType === TokenEnum.refresh ? signature.refresh_signature : signature.access_signature });
  if (!decoded ?. _id || !decoded?. _iat) {
    throw new BadRequestException("invalid token payload")
  }

  const user = await userModel.findOne({filter:{ _id: decoded._id }});
  if (!user) {
    throw new UnauthorizedException("user not found");
  }

  return {user,decoded};
}