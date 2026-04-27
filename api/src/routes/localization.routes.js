const express = require("express");
const Localization = require("../models/localization.model");

const router = express.Router();

function setNestedValue(target, dottedKey, value) {
  const segments = dottedKey.split(".");
  let pointer = target;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const isLeaf = index === segments.length - 1;

    if (isLeaf) {
      pointer[segment] = value;
      return;
    }

    if (!pointer[segment] || typeof pointer[segment] !== "object") {
      pointer[segment] = {};
    }

    pointer = pointer[segment];
  }
}

router.get("/", async (req, res, next) => {
  try {
    const requestedLocale = typeof req.query.locale === "string" ? req.query.locale.trim() : "";
    const where = requestedLocale ? { locale: requestedLocale } : undefined;

    const rows = await Localization.findAll({
      where,
      order: [
        ["locale", "ASC"],
        ["key", "ASC"],
      ],
    });

    const localizations = rows.reduce((acc, row) => {
      const locale = row.locale;

      if (!acc[locale]) {
        acc[locale] = {};
      }

      setNestedValue(acc[locale], row.key, row.value);
      return acc;
    }, {});

    return res.status(200).json({
      message: "Localizations fetched successfully",
      localizations,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/flat", async (req, res, next) => {
  try {
    const requestedLocale = typeof req.query.locale === "string" ? req.query.locale.trim() : "";
    const where = requestedLocale ? { locale: requestedLocale } : undefined;

    const data = await Localization.findAll({
      where,
      order: [
        ["locale", "ASC"],
        ["key", "ASC"],
      ],
    });

    return res.status(200).json({
      message: "Localizations fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/upsert", async (req, res, next) => {
  try {
    const locale = typeof req.body?.locale === "string" ? req.body.locale.trim() : "";
    const key = typeof req.body?.key === "string" ? req.body.key.trim() : "";
    const value = typeof req.body?.value === "string" ? req.body.value : "";

    if (!locale || !key) {
      return res.status(400).json({ message: "locale and key are required" });
    }

    const [localization, created] = await Localization.findOrCreate({
      where: { locale, key },
      defaults: { value },
    });

    if (!created) {
      localization.value = value;
      await localization.save();
    }

    return res.status(200).json({
      message: "Localization saved successfully",
      localization,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
