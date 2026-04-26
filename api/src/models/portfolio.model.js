const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Portfolio = sequelize.define(
    "Portfolio",
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
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "portfolios",
        timestamps: true,
    }
);
const Skill = require("./skill.model");
Portfolio.belongsToMany(Skill, { through: "stack_portfolio" });
module.exports = Portfolio;
