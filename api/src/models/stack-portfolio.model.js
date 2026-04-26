const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");
const Portfolio = require("./portfolio.model");
const Skill = require("./skill.model");

const StackPortfolio = sequelize.define(
  "StackPortfolio",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    portfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "portfolios",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "skills",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "stack_portfolios",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["portfolioId", "skillId"],
      },
    ],
  }
);

Portfolio.belongsToMany(Skill, {
  through: StackPortfolio,
  foreignKey: "portfolioId",
  otherKey: "skillId",
});

Skill.belongsToMany(Portfolio, {
  through: StackPortfolio,
  foreignKey: "skillId",
  otherKey: "portfolioId",
});

StackPortfolio.belongsTo(Portfolio, {
  foreignKey: "portfolioId",
});

StackPortfolio.belongsTo(Skill, {
  foreignKey: "skillId",
});

Portfolio.hasMany(StackPortfolio, {
  foreignKey: "portfolioId",
});

Skill.hasMany(StackPortfolio, {
  foreignKey: "skillId",
});

module.exports = StackPortfolio;
