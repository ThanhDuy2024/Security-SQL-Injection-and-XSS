import { DataTypes } from "sequelize";
import { sequelize } from "../configs/databaseORM.config.js";

export const Products = sequelize.define("products", {
    productName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
})