import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const User = db.define(
    'users',
    {
        nama: {
            type: DataTypes.STRING
        },
        phone_number: {
            type: DataTypes.STRING
        }
    },
    {
        freezeTableName: true,
        underscored: true
    }
)

export default User;