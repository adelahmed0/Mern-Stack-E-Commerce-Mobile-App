// Load environment variables from .env file
import ENV from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import chalk from "chalk";

// Set port from environment variables
const PORT = ENV.PORT;

// Establish database connection
connectDB();

// Start the Express server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(chalk.blue.bold(`🚀 Server is running on port ${PORT}`));
});

// Global handler for unhandled promise rejections (e.g., database connection issues)
process.on("unhandledRejection", (err: Error) => {
  console.log(
    chalk.red.bold(`✘ Unhandled Rejection: ${err.name} - ${err.message}`),
  );
  // Gracefully shutdown the server before exiting the process
  server.close(() => {
    console.log(chalk.yellow("Server closed due to unhandled rejection"));
    process.exit(1);
  });
});
