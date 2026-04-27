const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Localization = sequelize.define(
  "Localization",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    locale: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "localizations",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["locale", "key"],
      },
    ],
  }
);

module.exports = Localization;
