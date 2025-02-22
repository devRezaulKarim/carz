import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy.seed";
import { seedClassified } from "./classified.seed";
const prisma = new PrismaClient();
const main = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE;`;
  await seedTaxonomy(prisma);
  await seedClassified(prisma);
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
