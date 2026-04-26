const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const maintenanceMode = args.includes("--maintenance");

const env = {
  ...process.env,
  REACT_APP_MAINTENANCE_MODE: maintenanceMode ? "true" : process.env.REACT_APP_MAINTENANCE_MODE || "false",
};

const result = spawnSync("react-scripts", ["build"], {
  stdio: "inherit",
  env,
  shell: true,
});

process.exit(result.status ?? 1);

