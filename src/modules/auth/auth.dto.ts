// export interface IsignupBodyInputsDTO{
//     username: string;
//     password: string;
//     email: string;
// }

import { z } from 'zod'
import * as validators from './auth.validation'

export type IsignupBodyInputsDTO=z.infer<typeof validators.signup.body>