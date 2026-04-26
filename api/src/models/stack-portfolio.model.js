const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const StackPortfolio = sequelize.define(
    "StackPortfolio",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        tableName: "stack_portfolios",
        timestamps: true,
    }
);

module.exports = StackPortfolio;
