// export interface IsignupBodyInputsDTO{
//     username: string;
//     password: string;
//     email: string;
// }

import { z } from "zod";
import * as validators from "./auth.validation";
export type IconfirmEmailBodyInputsDTO = z.infer<
  typeof validators.confirmEmail.body
>;
export type IsignupBodyInputsDTO = z.infer<typeof validators.signup.body>;
export type ILognInBodyInputsDTO = z.infer<typeof validators.login.body>;