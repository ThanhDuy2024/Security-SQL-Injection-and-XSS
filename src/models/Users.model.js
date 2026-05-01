import { DataTypes } from "sequelize";
import { sequelize } from "../configs/databaseORM.config.js";

export const Users = sequelize.define("users", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false
})