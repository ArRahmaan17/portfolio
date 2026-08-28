const express = require("express");

const CurrentFocus = require("../models/current-focus.model");
const CurrentFocusCategory = require("../models/current-focus-category.model");

const router = express.Router();

const normalizeKey = (value) => String(value ?? "")
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const normalizeBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false") return false;
  return null;
};

function validateSharedPayload(body, { partial = false } = {}) {
  const fields = {};
  const errors = [];

  for (const field of ["title_en", "title_id"]) {
    if (!partial || body[field] !== undefined) {
      const value = String(body[field] ?? "").trim();
      if (!value) errors.push(`${field} is required`);
      else if (value.length > 160) errors.push(`${field} cannot exceed 160 characters`);
      else fields[field] = value;
    }
  }

  if (!partial || body.key !== undefined) {
    const key = normalizeKey(body.key || body.title_en);
    if (!key) errors.push("key is required");
    else if (key.length > 100) errors.push("key cannot exceed 100 characters");
    else fields.key = key;
  }

  if (!partial || body.sort_order !== undefined) {
    const sortOrder = Number(body.sort_order ?? 0);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) errors.push("sort_order must be a non-negative integer");
    else fields.sort_order = sortOrder;
  }

  if (!partial || body.is_active !== undefined) {
    const isActive = normalizeBoolean(body.is_active, true);
    if (isActive === null) errors.push("is_active must be a boolean");
    else fields.is_active = isActive;
  }

  return { fields, errors };
}

function validateFocusPayload(body, options) {
  const { fields, errors } = validateSharedPayload(body, options);
  const partial = Boolean(options?.partial);

  if (!partial || body.category_id !== undefined) {
    const categoryId = Number(body.category_id);
    if (!Number.isInteger(categoryId) || categoryId < 1) errors.push("category_id must be a positive integer");
    else fields.category_id = categoryId;
  }

  return { fields, errors };
}

async function keyExists(Model, key, excludedId = null) {
  if (!key) return false;
  const record = await Model.findOne({ where: { key } });
  return record && Number(record.id) !== Number(excludedId);
}

async function findCategory(categoryId) {
  if (!categoryId) return null;
  return CurrentFocusCategory.findByPk(categoryId);
}

function focusInclude(activeOnly) {
  return {
    model: CurrentFocus,
    as: "currentFocuses",
    where: activeOnly ? { is_active: true } : undefined,
    required: false,
    separate: true,
    order: [["sort_order", "ASC"], ["createdAt", "ASC"]],
  };
}

router.get("/", async (_req, res, next) => {
  try {
    const currentFocusCategories = await CurrentFocusCategory.findAll({
      where: { is_active: true },
      include: [focusInclude(true)],
      order: [["sort_order", "ASC"], ["createdAt", "ASC"]],
    });

    return res.status(200).json({
      message: "Current focus categories fetched successfully",
      currentFocusCategories,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/manage", async (_req, res, next) => {
  try {
    const currentFocusCategories = await CurrentFocusCategory.findAll({
      include: [focusInclude(false)],
      order: [["sort_order", "ASC"], ["createdAt", "ASC"]],
    });
    return res.status(200).json({
      message: "Current focus categories fetched successfully",
      currentFocusCategories,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/categories", async (req, res, next) => {
  try {
    const { fields, errors } = validateSharedPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });
    if (await keyExists(CurrentFocusCategory, fields.key)) return res.status(409).json({ message: "Category key already exists" });

    const currentFocusCategory = await CurrentFocusCategory.create(fields);
    return res.status(201).json({ message: "Current focus category created successfully", currentFocusCategory });
  } catch (error) {
    next(error);
  }
});

router.put("/categories/:id", async (req, res, next) => {
  try {
    const category = await CurrentFocusCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Current focus category not found" });

    const { fields, errors } = validateSharedPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });
    if (await keyExists(CurrentFocusCategory, fields.key, category.id)) return res.status(409).json({ message: "Category key already exists" });

    await category.update(fields);
    return res.status(200).json({ message: "Current focus category updated successfully", currentFocusCategory: category });
  } catch (error) {
    next(error);
  }
});

router.patch("/categories/:id", async (req, res, next) => {
  try {
    const category = await CurrentFocusCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Current focus category not found" });

    const { fields, errors } = validateSharedPayload(req.body, { partial: true });
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });
    if (!Object.keys(fields).length) return res.status(400).json({ message: "At least one field is required" });
    if (await keyExists(CurrentFocusCategory, fields.key, category.id)) return res.status(409).json({ message: "Category key already exists" });

    await category.update(fields);
    return res.status(200).json({ message: "Current focus category updated successfully", currentFocusCategory: category });
  } catch (error) {
    next(error);
  }
});

router.delete("/categories/:id", async (req, res, next) => {
  try {
    const category = await CurrentFocusCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Current focus category not found" });

    const itemCount = await CurrentFocus.count({ where: { category_id: category.id } });
    if (itemCount > 0) {
      return res.status(409).json({ message: "Move or delete this category's focus items before deleting it" });
    }

    await category.destroy();
    return res.status(200).json({ message: "Current focus category deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const currentFocus = await CurrentFocus.findByPk(req.params.id, {
      include: [{ model: CurrentFocusCategory, as: "category" }],
    });
    if (!currentFocus) return res.status(404).json({ message: "Current focus not found" });
    return res.status(200).json({ message: "Current focus fetched successfully", currentFocus });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { fields, errors } = validateFocusPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });
    if (!(await findCategory(fields.category_id))) return res.status(400).json({ message: "category_id does not reference an existing category" });
    if (await keyExists(CurrentFocus, fields.key)) return res.status(409).json({ message: "key already exists" });

    const currentFocus = await CurrentFocus.create(fields);
    return res.status(201).json({ message: "Current focus created successfully", currentFocus });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const currentFocus = await CurrentFocus.findByPk(req.params.id);
    if (!currentFocus) return res.status(404).json({ message: "Current focus not found" });

    const { fields, errors } = validateFocusPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });
    if (!(await findCategory(fields.category_id))) return res.status(400).json({ message: "category_id does not reference an existing category" });
    if (await keyExists(CurrentFocus, fields.key, currentFocus.id)) return res.status(409).json({ message: "key already exists" });

    await currentFocus.update(fields);
    return res.status(200).json({ message: "Current focus updated successfully", currentFocus });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const currentFocus = await CurrentFocus.findByPk(req.params.id);
    if (!currentFocus) return res.status(404).json({ message: "Current focus not found" });

    const { fields, errors } = validateFocusPayload(req.body, { partial: true });
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });
    if (!Object.keys(fields).length) return res.status(400).json({ message: "At least one field is required" });
    if (fields.category_id && !(await findCategory(fields.category_id))) return res.status(400).json({ message: "category_id does not reference an existing category" });
    if (await keyExists(CurrentFocus, fields.key, currentFocus.id)) return res.status(409).json({ message: "key already exists" });

    await currentFocus.update(fields);
    return res.status(200).json({ message: "Current focus updated successfully", currentFocus });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const currentFocus = await CurrentFocus.findByPk(req.params.id);
    if (!currentFocus) return res.status(404).json({ message: "Current focus not found" });
    await currentFocus.destroy();
    return res.status(200).json({ message: "Current focus deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
