const express = require("express");

const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const skillRoutes = require("./skill.routes");
const portfolioRoutes = require("./portfolio.routes");
const messageRoutes = require("./message.routes");
const blogRoutes = require("./blog.routes");



const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/skills", skillRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/messages", messageRoutes);
router.use("/blog", blogRoutes);

module.exports = router;
    
