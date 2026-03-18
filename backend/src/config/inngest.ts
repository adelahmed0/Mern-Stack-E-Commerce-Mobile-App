import { Inngest } from "inngest";
import connectDB from "./db.js";
import User from "../models/user.model.js";
import ENV from "./env.js";

if (!ENV.INNGEST.INNGEST_SIGNING_KEY && !process.env.INNGEST_DEV) {
  console.warn("⚠️ INNGEST_SIGNING_KEY is missing and INNGEST_DEV is not set.");
}

export const inngest = new Inngest({
  id: "Mern-Stack-E-Commerce-Mobile-App",
  signingKey: ENV.INNGEST.INNGEST_SIGNING_KEY,
});

const syncUser = inngest.createFunction(
  { id: "sync-user", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}` || "User",
      imageUrl: image_url,
      addresses: [],
      wishlist: [],
    };
    await User.create(newUser);
  },
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  },
);

export const functions: ReturnType<typeof inngest.createFunction>[] = [
  syncUser,
  deleteUserFromDB,
];
