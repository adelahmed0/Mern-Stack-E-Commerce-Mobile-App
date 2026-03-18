import { Inngest } from "inngest";
import connectDB from "./db.js";
import User from "../models/user.model.js";

export const inngest = new Inngest({ id: "Mern-Stack-E-Commerce-Mobile-App" });


const syncUser = inngest.createFunction(
   {id:"sync-user"},
   {event:"clerk/user.created"},
)


export const functions=[syncUser]