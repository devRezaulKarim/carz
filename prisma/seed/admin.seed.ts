import { hashPassword } from "../../src/lib/bcrypt";
import { PrismaClient } from "@prisma/client";

export const seedAdmin = async (prisma: PrismaClient) => {
  const email = "admin@admin.com";
  const password = await hashPassword("Admin@1");

  const admin = await prisma.user.create({
    data: { email, hashedPassword: password },
  });

  console.log("Admin created: ", admin);
};
