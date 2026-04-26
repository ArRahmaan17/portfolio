const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Skill = sequelize.define(
    "Skill",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "skills",
        timestamps: true,
    }
);
module.exports = Skill;
