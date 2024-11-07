import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Video = db.define(
    'videos', 
    {
        video: {
            type: DataTypes.STRING
        }
    },
    {
        freezeTableName: true,
        underscored: true
    }
)

export default Video;