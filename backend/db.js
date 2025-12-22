// db.js
import prismaPkg from "@prisma/client";
import * as adapterPkg from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = prismaPkg;
const { PrismaPg } = adapterPkg;

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);

export default prisma;
