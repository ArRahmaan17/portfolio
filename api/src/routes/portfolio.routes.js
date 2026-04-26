const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const Portfolio = require("../models/portfolio.model");
const Skill = require("../models/skill.model");
const StackPortfolio = require("../models/stack-portfolio.model");
const { saveFileBuffer } = require("../utils/storage.util");

const router = express.Router();
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const acceptedPortfolioMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const uploadPortfolioPicture = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024,
  },
});

const parseStacks = (stacks) => {
  if (!stacks) {
    return [];
  }

  if (Array.isArray(stacks)) {
    return stacks.map((stackId) => Number(stackId)).filter(Number.isFinite);
  }

  if (typeof stacks === "string") {
    if (stacks.includes(",")) {
      return stacks
        .split(",")
        .map((stackId) => Number(stackId.trim()))
        .filter(Number.isFinite);
    }

    try {
      const parsed = JSON.parse(stacks);
      if (Array.isArray(parsed)) {
        return parsed.map((stackId) => Number(stackId)).filter(Number.isFinite);
      }
    } catch (error) {
      return [];
    }
  }

  return [];
};

router.get("/", async (_req, res, next) => {
  try {
    const portfolios = await Portfolio.findAll({
      order: [["createdAt", "ASC"]],
      include: Skill
    });

    res.json({ message: "Portfolios fetched successfully", portfolios: portfolios });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id, {
      include: Skill,
    });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    return res.status(200).json({ message: "Portfolio fetched successfully", portfolio });
  } catch (error) {
    next(error);
  }
});

router.post("/", uploadPortfolioPicture.single("picture"), async (req, res, next) => {
  try {
    const { name, description, link } = req.body;
    const stacks = parseStacks(req.body.stacks);

    if (!name) {
      return res.status(400).json({
        message: "name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "picture file is required",
      });
    }

    if (!acceptedPortfolioMimeTypes.has(req.file.mimetype)) {
      return res.status(400).json({
        message: "picture file must be png, jpg, jpeg, or webp",
      });
    }

    let imageMeta;
    try {
      imageMeta = await sharp(req.file.buffer).metadata();
    } catch (error) {
      return res.status(400).json({
        message: "picture file is not a valid image",
      });
    }
    if (imageMeta.width !== OG_IMAGE_WIDTH || imageMeta.height !== OG_IMAGE_HEIGHT) {
      return res.status(400).json({
        message: `picture must be ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT} for optimal open-graph size`,
      });
    }

    const pictureWebpBuffer = await sharp(req.file.buffer)
      .webp({ quality: 85 })
      .toBuffer();
    const picture = await saveFileBuffer({
      subDirectory: "portfolios",
      extension: "webp",
      buffer: pictureWebpBuffer,
    });

    const portfolio = await Portfolio.create({
      name,
      description,
      link: link || null,
      picture,
    });

    if (stacks.length > 0) {
      const stackPortfolios = stacks.map((stack) => ({
        skillId: stack,
        portfolioId: portfolio.id,
      }));
      await StackPortfolio.bulkCreate(stackPortfolios);
    }

    return res.status(201).json({ message: "Portfolio created successfully", portfolio: portfolio });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", uploadPortfolioPicture.single("picture"), async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const { name, description, link } = req.body;
    const stacks = parseStacks(req.body.stacks);

    if (!name || !description) {
      return res.status(400).json({
        message: "name and description are required",
      });
    }

    const updates = { name, description, link: link || null };

    if (req.file) {
      if (!acceptedPortfolioMimeTypes.has(req.file.mimetype)) {
        return res.status(400).json({
          message: "picture file must be png, jpg, jpeg, or webp",
        });
      }

      let imageMeta;
      try {
        imageMeta = await sharp(req.file.buffer).metadata();
      } catch (error) {
        return res.status(400).json({
          message: "picture file is not a valid image",
        });
      }
      if (imageMeta.width !== OG_IMAGE_WIDTH || imageMeta.height !== OG_IMAGE_HEIGHT) {
        return res.status(400).json({
          message: `picture must be ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT} for optimal open-graph size`,
        });
      }

      const pictureWebpBuffer = await sharp(req.file.buffer)
        .webp({ quality: 85 })
        .toBuffer();
      updates.picture = await saveFileBuffer({
        subDirectory: "portfolios",
        extension: "webp",
        buffer: pictureWebpBuffer,
      });
    }

    await portfolio.update(updates);

    await StackPortfolio.destroy({ where: { portfolioId: portfolio.id } });
    if (stacks.length > 0) {
      const stackPortfolios = stacks.map((stack) => ({
        skillId: stack,
        portfolioId: portfolio.id,
      }));
      await StackPortfolio.bulkCreate(stackPortfolios);
    }

    const updated = await Portfolio.findByPk(portfolio.id, { include: Skill });
    return res.status(200).json({ message: "Portfolio updated successfully", portfolio: updated });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", uploadPortfolioPicture.single("picture"), async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const updates = {};
    if (req.body.name !== undefined) {
      if (!req.body.name) {
        return res.status(400).json({ message: "name cannot be empty" });
      }
      updates.name = req.body.name;
    }
    if (req.body.description !== undefined) {
      if (!req.body.description) {
        return res.status(400).json({ message: "description cannot be empty" });
      }
      updates.description = req.body.description;
    }
    if (req.body.link !== undefined) {
      updates.link = req.body.link || null;
    }

    if (req.file) {
      if (!acceptedPortfolioMimeTypes.has(req.file.mimetype)) {
        return res.status(400).json({
          message: "picture file must be png, jpg, jpeg, or webp",
        });
      }

      let imageMeta;
      try {
        imageMeta = await sharp(req.file.buffer).metadata();
      } catch (error) {
        return res.status(400).json({
          message: "picture file is not a valid image",
        });
      }
      if (imageMeta.width !== OG_IMAGE_WIDTH || imageMeta.height !== OG_IMAGE_HEIGHT) {
        return res.status(400).json({
          message: `picture must be ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT} for optimal open-graph size`,
        });
      }

      const pictureWebpBuffer = await sharp(req.file.buffer)
        .webp({ quality: 85 })
        .toBuffer();
      updates.picture = await saveFileBuffer({
        subDirectory: "portfolios",
        extension: "webp",
        buffer: pictureWebpBuffer,
      });
    }

    await portfolio.update(updates);

    if (req.body.stacks !== undefined) {
      const stacks = parseStacks(req.body.stacks);
      await StackPortfolio.destroy({ where: { portfolioId: portfolio.id } });
      if (stacks.length > 0) {
        const stackPortfolios = stacks.map((stack) => ({
          skillId: stack,
          portfolioId: portfolio.id,
        }));
        await StackPortfolio.bulkCreate(stackPortfolios);
      }
    }

    const updated = await Portfolio.findByPk(portfolio.id, { include: Skill });
    return res.status(200).json({ message: "Portfolio updated successfully", portfolio: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    await StackPortfolio.destroy({ where: { portfolioId: portfolio.id } });
    await portfolio.destroy();

    return res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
