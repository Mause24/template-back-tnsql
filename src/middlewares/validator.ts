import { NextFunction, Request, Response } from "express"
import Joi from "joi"

export const validatorBody = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body)
        if (error) {
            res.status(400).json({
                message: error.message,
            })
            return
        }
        next()
    }
}

export const validatorParams = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params)
        if (error) {
            res.status(400).json({
                message: error.message,
            })
            return
        }
        next()
    }
}
