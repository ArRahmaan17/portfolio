const express = require("express");
const { Op } = require('sequelize');
const Employee = require("../models/employee.model");
const { generateEmployees } = require("../utils/faker.util");

const router = express.Router();

function buildEmployeePayload(input, { partial = false } = {}) {
  const payload = {};

  const assign = (key, transform = (value) => value) => {
    if (input[key] === undefined) {
      return;
    }
    payload[key] = transform(input[key]);
  };

  assign("name", (value) => String(value).trim());
  assign("email", (value) => String(value).trim().toLowerCase());
  assign("role", (value) => String(value).trim());
  assign("department", (value) => String(value).trim());
  assign("salary", (value) => Number(value));
  assign("join_date", (value) => new Date(value));
  assign("status", (value) => String(value).trim());
  assign("performance", (value) => Number(value));
  assign("is_remote", (value) => Boolean(value));
  assign("avatar", (value) => String(value).trim());

  if (!partial) {
    const requiredKeys = [
      "name",
      "email",
      "role",
      "department",
      "salary",
      "join_date",
      "status",
      "performance",
      "is_remote",
      "avatar",
    ];
    const missing = requiredKeys.filter((key) => payload[key] === undefined);
    if (missing.length > 0) {
      return { error: `Missing required fields: ${missing.join(", ")}` };
    }
  }

  return { payload };
}

router.get("/", async (req, res, next) => {
  try {
    const allowedOrderFields = [
      "id",
      "name",
      "email",
      "role",
      "department",
      "salary",
      "join_date",
      "status",
      "performance",
      "is_remote",
      "createdAt",
      "updatedAt",
    ];
    const requestedField = String(req.query?.sort || "id");
    const requestedDirection = String(req.query?.order || "ASC").toUpperCase();
    const orderField = allowedOrderFields.includes(requestedField) ? requestedField : "id";
    const orderDirection = requestedDirection === "DESC" ? "DESC" : "ASC";
    const order = [[orderField, orderDirection]];
    let limit = parseInt(req.query?.limit) || 10;
    let page = parseInt(req.query?.page) || 1;

    if (isNaN(limit) || limit < 1 || limit > 100) {
      limit = 100;
    }

    if (isNaN(page) || page < 1) {
      page = 1;
    }
    const offset = (page - 1) * limit;

    if (req.query?.q) {
      const search = `%${String(req.query.q).trim()}%`;
      const data = await Employee.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: search } },
            { email: { [Op.like]: search } },
            { role: { [Op.like]: search } },
            { department: { [Op.like]: search } },
          ],
        },
        order: order,
        limit: limit,
        offset: offset,
      });

      return res.json({
        message: "Employees fetched successfully",
        total: data.count,
        data: data.rows,
      });
    }
    const { count, rows } = await Employee.findAndCountAll({
      order: order,
      offset: offset,
      limit: limit,
    }
    );

    res.json({
      message: "Employees fetched successfully",
      total: count,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { payload, error } = buildEmployeePayload(req.body || {});
    if (error) {
      return res.status(400).json({ message: error });
    }

    const data = await Employee.create(payload);
    return res.status(201).json({
      message: "Employee created successfully",
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

router.put("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { payload, error } = buildEmployeePayload(req.body || {});
    if (error) {
      return res.status(400).json({ message: error });
    }

    await employee.update(payload);
    return res.status(200).json({
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { payload } = buildEmployeePayload(req.body || {}, { partial: true });
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await employee.update(payload);
    return res.status(200).json({
      message: "Employee updated successfully",
      data: employee,
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

router.delete("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.destroy();
    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (_req, res, next) => {
  try {
    await Employee.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    return res.status(200).json({ message: "All employees deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
