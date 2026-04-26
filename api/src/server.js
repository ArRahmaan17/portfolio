require("dotenv").config();

const app = require("./app");
const bcrypt = require("bcrypt");
const sequelize = require("./config/database");
const User = require("./models/user.model");

const port = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({alter: true});

    app.listen(port, async () => {
      console.log(`Admin API listening on http://localhost:${port}`);
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
