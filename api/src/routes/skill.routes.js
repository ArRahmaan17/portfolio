const express = require("express");
const multer = require("multer");

const Skill = require("../models/skill.model");
const { saveFileBuffer } = require("../utils/storage.util");

const router = express.Router();
const uploadSkillIcon = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024,
  },
});

router.get("/", async (_req, res, next) => {
  try {
    const skills = await Skill.findAll({
      order: [["createdAt", "ASC"]],
    });

    res.json({ message: "Skills fetched successfully", skills: skills });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.status(200).json({ message: "Skill fetched successfully", skill });
  } catch (error) {
    next(error);
  }
});

router.post("/", uploadSkillIcon.single("icon"), async (req, res, next) => {
  try {
    const { name, description, start_date } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "icon file is required",
      });
    }

    if (req.file.mimetype !== "image/svg+xml") {
      return res.status(400).json({
        message: "icon file must be an SVG",
      });
    }

    const icon = await saveFileBuffer({
      subDirectory: "skills",
      extension: "svg",
      buffer: req.file.buffer,
    });

    const skill = await Skill.create({
      name,
      description,
      icon,
      start_date,
    });

    return res.status(201).json({ message: "Skill created successfully", skill: skill });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", uploadSkillIcon.single("icon"), async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const { name, description, start_date } = req.body;
    if (!name || !description || !start_date) {
      return res.status(400).json({
        message: "name, description, and start_date are required",
      });
    }

    const updates = { name, description, start_date };

    if (req.file) {
      if (req.file.mimetype !== "image/svg+xml") {
        return res.status(400).json({
          message: "icon file must be an SVG",
        });
      }

      updates.icon = await saveFileBuffer({
        subDirectory: "skills",
        extension: "svg",
        buffer: req.file.buffer,
      });
    }

    await skill.update(updates);
    return res.status(200).json({ message: "Skill updated successfully", skill });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", uploadSkillIcon.single("icon"), async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
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
    if (req.body.start_date !== undefined) {
      if (!req.body.start_date) {
        return res.status(400).json({ message: "start_date cannot be empty" });
      }
      updates.start_date = req.body.start_date;
    }

    if (req.file) {
      if (req.file.mimetype !== "image/svg+xml") {
        return res.status(400).json({ message: "icon file must be an SVG" });
      }
      updates.icon = await saveFileBuffer({
        subDirectory: "skills",
        extension: "svg",
        buffer: req.file.buffer,
      });
    }

    await skill.update(updates);
    return res.status(200).json({ message: "Skill updated successfully", skill });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await skill.destroy();
    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
