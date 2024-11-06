import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Image = db.define(
    'images', 
    {
        judul: {
            type: DataTypes.STRING
        },
        deskripsi: {
            type: DataTypes.STRING
        },
        gambar: {
            type: DataTypes.STRING
        }
    },
    {
        freezeTableName: true,
        underscored: true
    }
)

export default Image;