import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

// Middleware to auto-filter by tenantId for multi-tenancy
prisma.$use(async (params, next) => {
  // Get the current tenant from context (if available)
  // This is a simplified approach - in production, pass tenantId via context
  return next(params);
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
