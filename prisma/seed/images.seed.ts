import { imageSource } from "../../src/config/constants";
import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import { createPngDataUri } from "unlazy/thumbhash";

export default async function seedImages(prisma: PrismaClient) {
  const classifieds = await prisma.classified.findMany();

  const classifiedIds = classifieds.map((classified) => classified.id);
  for (const classifiedId of classifiedIds) {
    const image: Prisma.ImageCreateInput = {
      src: imageSource.classifiedPlaceholder,
      alt: faker.lorem.words(3),
      classified: {
        connect: {
          id: classifiedId,
        },
      },
      blurhash: createPngDataUri("4PcRHIS6iHiPd4d4hXVZl5CHCQ=="),
    };
    await prisma.image.create({ data: image });
  }
}
