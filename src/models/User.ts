import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize"
import { sequelize } from "../database"
import Profile from "./Profile"

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>
    declare name: string
    declare lastname: string
    declare email: string
    declare password: string
    declare avatarImage: CreationOptional<string>
    declare profileId: ForeignKey<Profile["id"]>
}

User.init(
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
        lastname: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        avatarImage: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
    }
)

User.belongsTo(Profile, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "profileId",
        allowNull: false,
    },
})

export default User
