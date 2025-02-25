/*
  Warnings:

  - The values [odoReadingSILVER] on the enum `Color` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Color_new" AS ENUM ('BLACK', 'BLUE', 'BROWN', 'GOLD', 'GREEN', 'GREY', 'ORANGE', 'PINK', 'PURPLE', 'SILVER', 'WHITE', 'YELLOW');
ALTER TABLE "classifieds" ALTER COLUMN "color" DROP DEFAULT;
ALTER TABLE "classifieds" ALTER COLUMN "color" TYPE "Color_new" USING ("color"::text::"Color_new");
ALTER TYPE "Color" RENAME TO "Color_old";
ALTER TYPE "Color_new" RENAME TO "Color";
DROP TYPE "Color_old";
ALTER TABLE "classifieds" ALTER COLUMN "color" SET DEFAULT 'BLACK';
COMMIT;
