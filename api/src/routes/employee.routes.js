const express = require("express");

const Employee = require("../models/employee.model");
const { generateEmployees } = require("../utils/faker.util");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await Employee.findAll({
      order: [["id", "ASC"]],
    });

    res.json({
      message: "Employees fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/regenerate", async (req, res, next) => {
  try {
    const requestedCount = Number(req.body?.count);
    const count = Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : 25;
    const payloads = generateEmployees(count);

    await Employee.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });
    await Employee.bulkCreate(payloads);

    return res.status(200).json({
      message: "Employees regenerated successfully",
      count: payloads.length,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json({
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
