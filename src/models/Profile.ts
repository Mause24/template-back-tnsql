import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize"

import { sequelize } from "../database"
import { PROFILES } from "../interfaces"

class Profile extends Model<
    InferAttributes<Profile>,
    InferCreationAttributes<Profile>
> {
    declare id: CreationOptional<number>
    declare name: string
}

Profile.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
    }
)

sequelize
    .sync()
    .then(() => {
        Object.entries(PROFILES).forEach(async element => {
            if (typeof element[1] === "number") {
                await Profile.findOrCreate({
                    where: { id: element[1], name: element[0] },
                })
            }
        })

        return true
    })
    .then(() => {
        console.log("PROFILES LOADED SUCCESSFULLY.")
    })
    .catch(err => {
        console.error("ERROR SYNCHRONIZING THE DATABASE:", err)
    })

export default Profile
