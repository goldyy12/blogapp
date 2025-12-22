// db.js
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);

export default prisma;