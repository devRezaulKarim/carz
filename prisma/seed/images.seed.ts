import { imageSource } from "../../src/config/constants";
import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import { createPngDataUri } from "unlazy/thumbhash";

export default async function seedImages(prisma: PrismaClient) {
  const classifieds = await prisma.classified.findMany();

  const classifiedIds = classifieds.map((classified) => classified.id);
  for (const classifiedId of classifiedIds) {
    const imgs = [...imageSource.classifiedPlaceholders]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    imgs.forEach((img) => {
      (async () => {
        const image: Prisma.ImageCreateInput = {
          src: img.placeholder,
          alt: faker.lorem.words(3),
          classified: {
            connect: {
              id: classifiedId,
            },
          },
          blurhash: createPngDataUri(img.blurhash),
        };
        await prisma.image.create({ data: image });
      })();
    });
  }
}
