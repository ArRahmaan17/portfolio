const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const maintenanceMode = args.includes("--maintenance");

const env = {
  ...process.env,
  // Safety default: production build is normal mode unless explicitly requested.
    REACT_APP_MAINTENANCE_MODE: maintenanceMode ? 1 : 0,
};

console.log(
  `[build] REACT_APP_MAINTENANCE_MODE=${env.REACT_APP_MAINTENANCE_MODE} (${maintenanceMode ? "maintenance" : "normal"})`
);

const result = spawnSync("react-scripts", ["build"], {
  stdio: "inherit",
  env,
  shell: true,
});

process.exit(result.status ?? 1);
