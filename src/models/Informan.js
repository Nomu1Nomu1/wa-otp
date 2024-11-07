import database from "../config/database.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const Informan = database.define(
    'data_informan', 
    {
        nama: {
            type: DataTypes.STRING
        },
        no_hp: {
            type: DataTypes.STRING
        }
    }, 
    {
        freezeTableName: true,
        underscored: true
    }
)

export default Informan;