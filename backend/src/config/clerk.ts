import { createClerkClient } from "@clerk/express";
import ENV from "./env.js";

/**
 * Clerk Client: Instance for performing backend operations
 * like managing users, sessions, and organizations.
 */
export const clerkClient = createClerkClient({
  publishableKey: ENV.CLERK.CLERK_PUBLISHABLE_KEY,
  secretKey: ENV.CLERK.CLERK_SECRET_KEY,
});

export default clerkClient;
