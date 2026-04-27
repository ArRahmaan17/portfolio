require("dotenv").config();

const app = require("./app");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const sequelize = require("./config/database");
const User = require("./models/user.model");
const Employee = require("./models/employee.model");
require("./models/localization.model");
const { syncDefaultLocalizations } = require("./localization/sync-localizations");
const { generateEmployees } = require("./utils/faker.util");

const port = Number(process.env.PORT) || 4000;
const employeeSeedCount = Number(process.env.EMPLOYEE_FAKE_COUNT) || 25;
const cronTimezone = process.env.CRON_TIMEZONE || "Asia/Jakarta";

async function regenerateEmployees() {
  const employeePayloads = generateEmployees(employeeSeedCount);
  await Employee.destroy({
    where: {},
    truncate: true,
    restartIdentity: true,
  });
  await Employee.bulkCreate(employeePayloads);
  console.log(`Employees regenerated: ${employeePayloads.length}`);
}

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(port, async () => {
      console.log(`Admin API listening on http://localhost:${port}`);
      await syncDefaultLocalizations();
      await regenerateEmployees();

      cron.schedule(
        "0 0 * * *",
        async () => {
          try {
            await regenerateEmployees();
          } catch (error) {
            console.error("Failed to regenerate employee data", error);
          }
        },
        { timezone: cronTimezone }
      );
      console.log(`Employee regeneration cron started (0 0 * * *, timezone: ${cronTimezone})`);

      const admin = await User.count();
      if (admin > 0) {
        return;
      }
      await User.create({
        name: "Admin",
        email: "ardrah17@gmail.com",
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      });
    });
  } catch (error) {
    console.error("Failed to start admin API", error);
    process.exit(1);
  }
}

startServer();
