require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
var { expressjwt: jwt } = require("express-jwt");

const apiRoutes = require("./routes");

const app = express();
const JWT_EXCLUDED_PATHS = [
  "/",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/storage",
  "/api/health",
  { url: /^\/api\/blog(\/.*)?$/, methods: ["GET"] },
  { url: "/api/employees", methods: ["GET", "POST", "DELETE"] },
  { url: /^\/api\/employees\/\d+$/, methods: ["GET", "PUT", "PATCH", "DELETE"] },
  { url: /^\/api\/localizations(\/.*)?$/, methods: ["GET"] },
  { url: /^\/api\/portfolios(\/.*)?$/, methods: ["GET"] },
  { url: /^\/api\/skills(\/.*)?$/, methods: ["GET"] },
  { url: /^\/api\/current-focus(?:\/\d+)?\/?$/, methods: ["GET"] },
  { url: /^\/api\/messages(\/.*)?$/, methods: ["POST"] },
];

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

function isJwtExcludedRoute(req) {
  const requestPath = req.path;
  const requestMethod = req.method;

  return JWT_EXCLUDED_PATHS.some((rule) => {
    if (typeof rule === "string") {
      return requestPath === rule || requestPath.startsWith(`${rule}/`);
    }

    const urlMatches =
      typeof rule.url === "string"
        ? requestPath === rule.url || requestPath.startsWith(`${rule.url}/`)
        : rule.url.test(requestPath);
    const methodMatches =
      !rule.methods ||
      rule.methods.some((method) => method.toUpperCase() === requestMethod);

    return urlMatches && methodMatches;
  });
}

const getJwtToken = (req) => {
  if (req.cookies && req.cookies.admin_token) {
    return req.cookies.admin_token;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  return null;
};

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/storage", express.static(path.resolve(__dirname, "../storage")));
app.use(globalLimiter);
app.use((req, res, next) => {
  if (!isJwtExcludedRoute(req)) {
    return next();
  }

  return publicLimiter(req, res, next);
});
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    getToken: getJwtToken,
  }).unless({
    path: JWT_EXCLUDED_PATHS,
  })
);

app.get("/", async (_req, res) => {
    res.json({
      message: "Admin API is running",
    });
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((err, _req, res, _next) => {
  // express-jwt uses `UnauthorizedError` for missing/invalid tokens.
  // Return 401 consistently for all routes (except those excluded via `unless`).
  if (err && (err.name === "UnauthorizedError" || err.status === 401)) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

module.exports = app;
