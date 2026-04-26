const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Email = sequelize.define(
    "Email",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        tableName: "emails",
        timestamps: true,
    }
);
module.exports = Email;
