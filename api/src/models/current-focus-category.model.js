const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const CurrentFocusCategory = sequelize.define(
  "CurrentFocusCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      },
    },
    title_en: {
      type: DataTypes.STRING(160),
      allowNull: false,
      validate: { notEmpty: true },
    },
    title_id: {
      type: DataTypes.STRING(160),
      allowNull: false,
      validate: { notEmpty: true },
    },
    sort_order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "current_focus_categories",
    timestamps: true,
    indexes: [{ fields: ["is_active", "sort_order"] }],
  }
);

module.exports = CurrentFocusCategory;
