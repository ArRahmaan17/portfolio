const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "blogs",
    timestamps: true,
  }
);

module.exports = Blog;
