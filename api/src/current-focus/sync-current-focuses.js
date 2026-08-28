const CurrentFocus = require("../models/current-focus.model");
const CurrentFocusCategory = require("../models/current-focus-category.model");
const { PROGRAMMING_CATEGORY } = require("./migrate-current-focuses");

const DEFAULT_CURRENT_FOCUSES = [
  {
    key: "product-interfaces",
    title_en: "Product interfaces",
    title_id: "Antarmuka produk",
    sort_order: 10,
    is_active: true,
  },
  {
    key: "reliable-apis",
    title_en: "Reliable APIs",
    title_id: "API yang andal",
    sort_order: 20,
    is_active: true,
  },
  {
    key: "maintainable-systems",
    title_en: "Maintainable systems",
    title_id: "Sistem yang mudah dipelihara",
    sort_order: 30,
    is_active: true,
  },
];

async function syncDefaultCurrentFocuses() {
  const [programmingCategory] = await CurrentFocusCategory.findOrCreate({
    where: { key: PROGRAMMING_CATEGORY.key },
    defaults: PROGRAMMING_CATEGORY,
  });
  const existingCount = await CurrentFocus.count();
  if (existingCount > 0) return;
  await CurrentFocus.bulkCreate(
    DEFAULT_CURRENT_FOCUSES.map((focus) => ({
      ...focus,
      category_id: programmingCategory.id,
    }))
  );
}

module.exports = {
  DEFAULT_CURRENT_FOCUSES,
  syncDefaultCurrentFocuses,
};
