const express = require("express");

const CurrentFocus = require("../models/current-focus.model");

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

function validatePayload(body, { partial = false } = {}) {
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

router.get("/", async (req, res, next) => {
  try {
    const currentFocuses = await CurrentFocus.findAll({
      where: { is_active: true },
      order: [["sort_order", "ASC"], ["createdAt", "ASC"]],
    });

    return res.status(200).json({
      message: "Current focuses fetched successfully",
      currentFocuses,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/manage", async (_req, res, next) => {
  try {
    const currentFocuses = await CurrentFocus.findAll({
      order: [["sort_order", "ASC"], ["createdAt", "ASC"]],
    });
    return res.status(200).json({
      message: "Current focuses fetched successfully",
      currentFocuses,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const currentFocus = await CurrentFocus.findByPk(req.params.id);
    if (!currentFocus) return res.status(404).json({ message: "Current focus not found" });
    return res.status(200).json({ message: "Current focus fetched successfully", currentFocus });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { fields, errors } = validatePayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });

    const existing = await CurrentFocus.findOne({ where: { key: fields.key } });
    if (existing) return res.status(409).json({ message: "key already exists" });

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

    const { fields, errors } = validatePayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });

    const duplicate = await CurrentFocus.findOne({ where: { key: fields.key } });
    if (duplicate && Number(duplicate.id) !== Number(currentFocus.id)) {
      return res.status(409).json({ message: "key already exists" });
    }

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

    const { fields, errors } = validatePayload(req.body, { partial: true });
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });
    if (!Object.keys(fields).length) return res.status(400).json({ message: "At least one field is required" });

    if (fields.key) {
      const duplicate = await CurrentFocus.findOne({ where: { key: fields.key } });
      if (duplicate && Number(duplicate.id) !== Number(currentFocus.id)) {
        return res.status(409).json({ message: "key already exists" });
      }
    }

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
