import { Sequelize } from "sequelize"
import config from "./config"

export const sequelize = new Sequelize({
    dialect: "mysql",
    database: config.DATABASE,
    host: config.HOST,
    password: config.PASSWORD,
    username: config.USER,
    port: config.DB_PORT,
    logging: console.log,
})

export const onConnect = async () => {
    try {
        await sequelize.authenticate()
        console.log("Connection has been established successfully.")
        await sequelize.sync()
        console.log("All models were synchronized successfully.")
    } catch (error) {
        console.error("Unable to connect to the database:", error)
    }
}
