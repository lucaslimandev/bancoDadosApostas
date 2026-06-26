import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { resolveDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = resolveDatabaseUrl();
const usaPostgres = databaseUrl.startsWith("postgres");

const adapter = usaPostgres ? new PrismaPg({ connectionString: databaseUrl }) : new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
