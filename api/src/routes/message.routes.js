const express = require("express");

const Message = require("../models/message.model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let messages = await Message.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({
      message: "Message retrieved successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { email, message } = req.body;
    const fullName = req.body.fullName ?? req.body.name;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        message: "fullName (or name), email, and message are required",
      });
    }

    const createdMessage = await Message.create({
      fullName,
      email,
      message,
    });

    return res.status(201).json({
      message: "Message created successfully",
      data: createdMessage,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.destroy();
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
