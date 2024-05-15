import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import config from "../config"
import { JWTInterface, PROFILES } from "../interfaces"
import User from "../models/User"
import { haveSameInterface, RESPONSES } from "../utils"

export const authentication =
    (rol?: PROFILES[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.headers.authorization) {
                res.status(RESPONSES.MISSING_TOKEN.status).json({
                    message: RESPONSES.MISSING_TOKEN.message,
                })
                return
            }

            const token = req.headers.authorization.split(" ")[1]

            if (!config.KEY || !token || !jwt.verify(token, config.KEY)) {
                res.status(RESPONSES.AUTHORIZATION_REQUIRED.status).json({
                    message: RESPONSES.AUTHORIZATION_REQUIRED.message,
                })
                return
            }

            const jwtDecoded = parseTokenToObject(token)

            if (typeof jwtDecoded !== "object" || !jwtDecoded) {
                res.status(RESPONSES.INVALID_TOKEN.status).json({
                    message: RESPONSES.INVALID_TOKEN.message,
                })
                return
            }

            const user = await User.findOne({
                where: { id: jwtDecoded.id },
            })

            if (!user || rol?.every(item => item !== user.profileId)) {
                res.status(RESPONSES.UNAUTHORIZED.status).json({
                    message: RESPONSES.UNAUTHORIZED.message,
                })
                return
            }
            req.query["jwt"] = JSON.stringify(jwtDecoded)
            next()
        } catch (error) {
            console.error(error)
            res.status(RESPONSES.SERVER_ERROR.status).json({
                message: RESPONSES.SERVER_ERROR.message,
            })
        }
    }

export const parseTokenToObject = (token: string): JWTInterface | undefined => {
    if (!jwt.verify(token, config.KEY)) return
    const jwtDecoded = jwt.decode(token)
    const testObject: JWTInterface = {
        email: "correoPrueba@gmail.com",
        id: 1,
        profileId: PROFILES.CLIENT,
        password: "Hola123",
        iat: 1715226237,
    }
    const result = haveSameInterface(jwtDecoded as object, testObject)

    if (result) {
        return jwtDecoded as JWTInterface
    }
}
