import dotenv from "dotenv";
dotenv.config();

/**
 * Validates and exports environment variables.
 * Centralizing environment variables makes it easier to manage and validate them.
 */
export const ENV = {
  // Application Info
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  API_PREFIX: process.env.API_PREFIX || "/api",
  BASE_URL: process.env.BASE_URL || "http://localhost:8000",

  // Database
  MONGO_URI: process.env.MONGO_URI as string,

  // JWT configuration
  JWT: {
    SECRET: process.env.JWT_SECRET as string,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  },

  // Email Configuration (Nodemailer)
  EMAIL: {
    HOST: process.env.EMAIL_HOST,
    PORT: Number(process.env.EMAIL_PORT),
    SECURE: process.env.EMAIL_SECURE === "true",
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
  },

  // Stripe Configuration
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },

  // Clerk Configuration
  CLERK: {
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },

  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },

  // Ingest Configuration
  INNGEST: {
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  },
};

export default ENV;
