import dotenv from "dotenv"

dotenv.config()
export default {
    KEY: String(process.env.APP_KEY),
    USER: String(process.env.APP_USER),
    DATABASE: String(process.env.APP_DATABASE),
    PASSWORD: String(process.env.APP_PASSWORD),
    HOST: String(process.env.APP_HOST),
    DB_PORT: Number(process.env.APP_DB_PORT),
    PORT: Number(process.env.APP_PORT),
    HASH: Number(process.env.APP_HASH_SALTS),
    URL: String(process.env.APP_URL),
}
