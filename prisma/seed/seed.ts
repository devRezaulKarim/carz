import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy.seed";
const prisma = new PrismaClient();
const main = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE;`;
  await seedTaxonomy(prisma);
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
