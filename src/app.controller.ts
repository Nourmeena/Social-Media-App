import { resolve } from 'node:path'
import { config } from 'dotenv'
config({ path: resolve('./config/.env.development') })

import type { Request, Response, Express } from 'express'
import express from "express"

import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import authController from './modules/auth/auth.controller'
import userController from "./modules/user/user.controller";
import { globalErrorHandling } from "./utils/responses/error.response";

import connectDB from './DB/connection.db'

const limiter = rateLimit({
    windowMs: 60 * 60000,
    max: 2000,
    message: "Too many request, please try again later" ,
    statusCode:429,
})

const bootstrap = async(): Promise<void> => {
    const app: Express = express()
    const port: number | string = process.env.PORT || 5000
    app.use(cors(), helmet(), limiter, express.json())
    
    app.use('/auth', authController)
    app.use("/user", userController);
    await connectDB()
    app.use(globalErrorHandling)

    app.get("/", (req: Request, res: Response) => {
        res.json({ message: `welcome to ${process.env.APPLICATION_NAME} backend landing page` })
    })

    app.listen(port, () => {
        console.log(`server is running at ${port} 🛬`)
    })
}


export default bootstrap


