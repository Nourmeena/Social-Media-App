import { Router } from 'express'
import { authentication } from "../../middleware/authorization.middleware";
import userService from './user.service'
const router = Router()

router.get("/profile", authentication(),userService.profile);

export default router