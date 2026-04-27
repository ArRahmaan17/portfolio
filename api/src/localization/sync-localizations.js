const Localization = require("../models/localization.model");
const defaultLocalizations = require("./default-localizations");

function flattenObject(input, prefix = "") {
  return Object.entries(input).reduce((acc, [key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return {
        ...acc,
        ...flattenObject(value, nextKey),
      };
    }

    return {
      ...acc,
      [nextKey]: String(value),
    };
  }, {});
}

async function syncDefaultLocalizations() {
  const rows = Object.entries(defaultLocalizations).flatMap(([locale, table]) => {
    const flattened = flattenObject(table);

    return Object.entries(flattened).map(([key, value]) => ({
      locale,
      key,
      value,
    }));
  });

  for (const row of rows) {
    await Localization.findOrCreate({
      where: {
        locale: row.locale,
        key: row.key,
      },
      defaults: {
        value: row.value,
      },
    });
  }
}

module.exports = {
  syncDefaultLocalizations,
};
