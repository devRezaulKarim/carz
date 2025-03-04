import { imageSource } from "../../src/config/constants";
import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import { createPngDataUri } from "unlazy/thumbhash";

export default async function seedImages(prisma: PrismaClient) {
  const classifieds = await prisma.classified.findMany();

  const classifiedIds = classifieds.map((classified) => classified.id);
  for (const classifiedId of classifiedIds) {
    for (let i = 0; i < 2; i++) {
      const index = Math.floor(
        Math.random() * imageSource.classifiedPlaceholders.length,
      );
      const image: Prisma.ImageCreateInput = {
        src: imageSource.classifiedPlaceholders[index].placeholder,
        alt: faker.lorem.words(3),
        classified: {
          connect: {
            id: classifiedId,
          },
        },
        blurhash: createPngDataUri(
          imageSource.classifiedPlaceholders[index].blurhash,
        ),
      };

      await prisma.image.create({ data: image });
    }
  }
}
