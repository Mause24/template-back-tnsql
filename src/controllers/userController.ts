import { Request, Response } from "express"
import {
    CannotEditException,
    IncorrectPasswordException,
    MissingAttributeException,
    UserEmailAlreadyExistException,
    UserNotFoundException,
} from "../errors"
import { JWTInterface, UserModelInterface } from "../interfaces"
import {
    loginService,
    registerService,
    updateImageUserService,
} from "../services"
import { RESPONSES } from "../utils"

export const login = async (
    req: Request<any, any, Pick<UserModelInterface, "email" | "password">>,
    res: Response
) => {
    try {
        const { user, token } = await loginService(req.body)
        res.status(RESPONSES.OK.status).json({
            message: RESPONSES.OK.message,
            data: {
                token,
                user,
            },
        })
    } catch (error) {
        if (error instanceof IncorrectPasswordException) {
            res.status(RESPONSES.INCORRECT_PASSWORD.status).json({
                message: RESPONSES.INCORRECT_PASSWORD.message,
            })
            return
        }
        if (error instanceof UserNotFoundException) {
            res.status(RESPONSES.USER_NOT_FOUND.status).json({
                message: RESPONSES.USER_NOT_FOUND.message,
            })
            return
        }
        console.error(error)
        res.status(RESPONSES.SERVER_ERROR.status).json({
            message: RESPONSES.SERVER_ERROR.message,
        })
    }
}

export const register = async (
    req: Request<any, any, Omit<UserModelInterface, "profileId">>,
    res: Response
) => {
    try {
        const user = await registerService(req.body)
        res.status(RESPONSES.CREATED.status).json({
            message: RESPONSES.CREATED.message,
            data: user,
        })
    } catch (error) {
        if (error instanceof UserNotFoundException) {
            res.status(RESPONSES.USER_NOT_FOUND.status).json({
                message: RESPONSES.USER_NOT_FOUND.message,
            })
            return
        }
        if (error instanceof UserEmailAlreadyExistException) {
            res.status(RESPONSES.EMAIL_ALREADY_EXIST.status).json({
                message: RESPONSES.EMAIL_ALREADY_EXIST.message,
            })
            return
        }
        console.error(error)
        res.status(RESPONSES.SERVER_ERROR.status).json({
            message: RESPONSES.SERVER_ERROR.message,
        })
    }
}

export const updateImageUser = async (
    req: Request<any, any, any>,
    res: Response
) => {
    try {
        const parsedUser = JSON.parse(
            (req.query["jwt"] as string) ?? ""
        ) as JWTInterface
        const user = await updateImageUserService(req.file, parsedUser.id)
        res.status(RESPONSES.UPDATED.status).json({
            message: RESPONSES.UPDATED.message,
            data: user,
        })
    } catch (error) {
        if (error instanceof MissingAttributeException) {
            res.status(RESPONSES.MISSING_ATTRIBUTE.status).json({
                message: RESPONSES.MISSING_ATTRIBUTE.message,
            })
            return
        }
        if (error instanceof CannotEditException) {
            res.status(RESPONSES.CANNOT_UPDATE.status).json({
                message: RESPONSES.CANNOT_UPDATE.message,
            })
            return
        }
        console.error(error)
        res.status(RESPONSES.SERVER_ERROR.status).json({
            message: RESPONSES.SERVER_ERROR.message,
        })
    }
}
