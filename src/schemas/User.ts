import Joi from "joi"

export const passwordRegex =
    /(?=.*[A-Z].*)(?=.*[0-9].*)(?=.*[\*\-\,\.\/\_\=\+\{\[\}\]].*)/

export const registerSchema = Joi.object({
    email: Joi.string()
        .required()
        .email()
        .message("El correo debe de ser con un formato valido"),
    password: Joi.string()
        .min(8)
        .message("La contraseña debe ser minimo de 8 caracteres")
        .required()
        .regex(passwordRegex)
        .message("La contraseña debe ser en un formato valido"),
    name: Joi.string().required(),
    lastname: Joi.string().required(),
})

export const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .email()
        .message("El correo debe de ser con un formato valido"),
    password: Joi.string()
        .min(8)
        .message("La contraseña debe ser minimo de 8 caracteres")
        .required()
        .regex(passwordRegex)
        .message("La contraseña debe ser en un formato valido"),
})
export const uploadImage = Joi.object({
    image: Joi.any()
        .meta({ swaggerType: "file" })
        .required()
        .description("Debe subir un formato valido."),
})
