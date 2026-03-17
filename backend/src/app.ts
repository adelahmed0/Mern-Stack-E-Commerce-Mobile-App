// 1) IMPORTS
import path from "path";
import { fileURLToPath } from "url";
import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import mongoSanitize from "express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";

// Application routes and global utilities
import ENV from "./config/env.js";
import routes from "./routes/index.js";
import { ApiError } from "./utils/apiError.js";
import globalError from "./middleware/globalError.middleware.js";

// 2) SETUP & INITIALIZATION
const app: Application = express();
const api = ENV.API_PREFIX;

// Helper to handle ESM directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3) GLOBAL MIDDLEWARES (Security, CORS, Logging, etc.)
// Enable CORS for all requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
  }),
);

// Set security HTTP headers
app.use(helmet());

// Compress response bodies for performance
app.use(compression());

// Logging (Development only)
if (ENV.NODE_ENV === "development") {
  app.use(
    morgan((tokens, req, res) => {
      const status = Number(tokens.status(req, res));
      const method = tokens.method(req, res);
      const url = tokens.url(req, res);
      const responseTime = tokens["response-time"](req, res);

      // Color coding for terminal logs
      const methodColors: Record<string, any> = {
        GET: chalk.green.bold,
        POST: chalk.yellow.bold,
        PUT: chalk.cyan.bold,
        DELETE: chalk.red.bold,
        PATCH: chalk.magenta.bold,
      };
      const methodColor = methodColors[method || ""] || chalk.white.bold;

      let statusColor = chalk.green;
      if (status >= 500) statusColor = chalk.red.bold;
      else if (status >= 400) statusColor = chalk.red;
      else if (status >= 300) statusColor = chalk.yellow;

      return [
        chalk.gray(`[${new Date().toLocaleTimeString()}]`),
        chalk.magenta.bold(`API »`),
        methodColor(method?.padEnd(7)),
        chalk.white(url),
        statusColor(status),
        chalk.gray(`(${responseTime} ms)`),
      ].join(" ");
    }),
  );
}

// 4) BODY PARSERS & SANITIZATION
// Parse query strings and JSON/URL-encoded data
app.set("query parser", "extended");
// Standard body size limit
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

// Data Sanitization against NoSQL query injection
app.use((req: Request, res: Response, next: NextFunction) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);
  next();
});

// Data Sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  }),
);

// 5) STATIC FILES
// Serve static files from the uploads directory
app.use(express.static(path.join(__dirname, "uploads")));

// Serve admin frontend static files (Production only recommended)
const adminDistPath = path.join(__dirname, "../..", "admin", "dist");
app.use(express.static(adminDistPath));

// 6) RATE LIMITING
// Global Rate Limiting: Prevent brute-force and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 100, // Max 100 requests per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests, please try again after 15 minutes.",
});
app.use(`${api}`, limiter);

// 7) MOUNT ROUTES
app.use(`${api}`, routes);

// 8) 404 HANDLER / FRONTEND FALLBACK
// Serve index.html for any frontend routes that aren't API calls
app.get("/:all*", (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith(api)) {
    return next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
  }
  res.sendFile(path.join(adminDistPath, "index.html"));
});

// Fallback for any route not matched by the routers above (API only)
app.all(`${api}/:all*`, (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// 9) GLOBAL ERROR HANDLING
// Middleware to catch all errors passed to next()
app.use(globalError);

export default app;

