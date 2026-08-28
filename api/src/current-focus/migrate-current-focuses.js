const { DataTypes, QueryTypes } = require("sequelize");

const sequelize = require("../config/database");
const CurrentFocusCategory = require("../models/current-focus-category.model");

const PROGRAMMING_CATEGORY = {
  key: "programming",
  title_en: "Programming",
  title_id: "Pemrograman",
  sort_order: 10,
  is_active: true,
};

async function ensureCurrentFocusSchema() {
  const [programmingCategory] = await CurrentFocusCategory.findOrCreate({
    where: { key: PROGRAMMING_CATEGORY.key },
    defaults: PROGRAMMING_CATEGORY,
  });

  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const hasCurrentFocusTable = tables.some((table) => {
    const tableName = typeof table === "string"
      ? table
      : table.tableName || table.table_name;
    return tableName === "current_focuses";
  });
  if (!hasCurrentFocusTable) return programmingCategory;

  const table = await queryInterface.describeTable("current_focuses");

  if (!table.category_id) {
    await queryInterface.addColumn("current_focuses", "category_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "current_focus_categories",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });
  }

  await sequelize.query(
    "UPDATE `current_focuses` SET `category_id` = :categoryId WHERE `category_id` IS NULL",
    {
      replacements: { categoryId: programmingCategory.id },
      type: QueryTypes.UPDATE,
    }
  );

  const updatedTable = await queryInterface.describeTable("current_focuses");
  if (updatedTable.category_id.allowNull) {
    await queryInterface.changeColumn("current_focuses", "category_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });
  }

  const indexes = await queryInterface.showIndex("current_focuses");
  const hasCategoryOrderIndex = indexes.some((index) => {
    const fields = index.fields.map((field) => field.attribute || field.name);
    return ["category_id", "is_active", "sort_order"].every(
      (field, position) => fields[position] === field
    );
  });
  if (!hasCategoryOrderIndex) {
    await queryInterface.addIndex(
      "current_focuses",
      ["category_id", "is_active", "sort_order"],
      { name: "current_focuses_category_active_order" }
    );
  }

  return programmingCategory;
}

module.exports = {
  PROGRAMMING_CATEGORY,
  ensureCurrentFocusSchema,
};
