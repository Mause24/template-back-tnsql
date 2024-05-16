import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config"
import {
    CannotEditException,
    IncorrectPasswordException,
    MissingAttributeException,
    UserEmailAlreadyExistException,
    UserNotFoundException,
} from "../errors"
import { JWTInterface, PROFILES, UserModelInterface } from "../interfaces"
import User from "../models/User"

export const registerService = async (
    body: Omit<UserModelInterface, "profileId">
) => {
    const encryptPassword = await bcrypt.hash(body.password, config.HASH)
    const userEmail = await User.findOne({
        where: { email: body.email },
    })

    if (userEmail) {
        throw new UserEmailAlreadyExistException()
    }

    const user = await User.create({
        ...body,
        password: encryptPassword,
        profileId: PROFILES.CLIENT,
    })

    return user
}

export const loginService = async (
    body: Pick<UserModelInterface, "email" | "password">
) => {
    const user = await User.findOne({
        where: { email: body.email },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
    })

    if (!user) {
        throw new UserNotFoundException()
    }

    const validatePassword = await bcrypt.compare(body.password, user.password)

    if (!validatePassword) {
        throw new IncorrectPasswordException()
    }

    const token = jwt.sign(
        {
            email: user.toJSON().email,
            id: user.toJSON().id,
            password: user.toJSON().password,
            profileId: user.toJSON().profileId,
        } as JWTInterface,
        config.KEY
    )

    return {
        user,
        token,
    }
}

export const updateImageUserService = async (
    file?: Express.Multer.File,
    tokenId?: number
) => {
    if (!file || !tokenId) {
        throw new MissingAttributeException()
    }

    const avatarUrl = [
        config.URL,
        "static",
        String(file.destination.split("\\").pop()),
        String(file.filename.split("\\").pop()),
    ].join("/")

    const [rows, userUpdated] = await User.update(
        { avatarImage: avatarUrl },
        {
            where: {
                id: tokenId,
            },
            returning: true,
        }
    )

    if (rows <= 0) {
        throw new CannotEditException()
    }

    return userUpdated[0]
}
