import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Construct absolute path to ensure we hit the correct DB
const dbPath = path.join(process.cwd(), "dev.db");
const connectionUrl = `file:${dbPath}`;

console.log("DB Init - Absolute URL:", connectionUrl);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasources: {
      db: {
        url: connectionUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
