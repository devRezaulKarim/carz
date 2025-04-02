import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy.seed";
import { seedClassified } from "./classified.seed";
import seedImages from "./images.seed";
import { seedAdmin } from "./admin.seed";
import { seedCustomers } from "./customers.seed";
const prisma = new PrismaClient();
const main = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE;`;
  await seedTaxonomy(prisma);
  await seedClassified(prisma);
  await seedImages(prisma);
  await seedAdmin(prisma);
  await seedCustomers(prisma);
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
