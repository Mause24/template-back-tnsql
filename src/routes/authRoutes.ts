import { Router } from "express"
import { login, register } from "../controllers"
import { validatorBody } from "../middlewares"
import { loginSchema, registerSchema } from "../schemas"

export const authRoutes = Router()
//ROUTES
authRoutes.post("/login", validatorBody(loginSchema), login)
authRoutes.post("/register", validatorBody(registerSchema), register)
