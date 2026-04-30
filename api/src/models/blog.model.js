const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const BLOG_CONTENT_MAX_LENGTH = 50000;

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
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        len: [1, BLOG_CONTENT_MAX_LENGTH],
      },
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
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = Blog;
module.exports.BLOG_CONTENT_MAX_LENGTH = BLOG_CONTENT_MAX_LENGTH;
