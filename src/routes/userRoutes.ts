import { Router } from "express"
import { updateImageUser } from "../controllers"
import { authentication, upload } from "../middlewares"

export const userRoutes = Router()
//ROUTES
userRoutes.patch(
    "/image",
    authentication(),
    upload().single("image"),
    updateImageUser
)
