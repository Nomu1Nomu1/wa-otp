import database from "../config/database.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const Users = database.define(
    'data_informan', 
    {
        nama: {
            type: DataTypes.STRING
        },
        no_hp: {
            type: DataTypes.STRING
        }
    }
)

export default Users;