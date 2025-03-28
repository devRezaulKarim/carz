import { prisma } from "../../prisma/prisma";
import type { ModelVariant } from "@prisma/client";

interface mapToiTaxonomyOrCreateType {
  year: number;
  make: string;
  model: string;
  modelVariant: string | null;
}
export async function mapToiTaxonomyOrCreate(obj: mapToiTaxonomyOrCreateType) {
  //attempt to find make
  const make = await prisma.make.findFirst({
    where: { name: { equals: obj.make, mode: "insensitive" } },
  });
  if (!make) throw new Error(`Make ${obj.make} not found`);

  //attempt to find model
  let model = await prisma.model.findFirst({
    where: { makeId: make.id, name: { equals: obj.make, mode: "insensitive" } },
  });

  if (!model) {
    model = await prisma.$transaction(async () => {
      await prisma.$executeRaw`LOCK TABLE "models" IN EXCLUSIVE MODE`;

      return await prisma.model.create({
        data: {
          name: obj.model,
          make: { connect: { id: make.id } },
        },
      });
    });
  }
  if (!model) throw new Error(`Model not found`);

  //attempt to find model variant
  let modelVariant: ModelVariant | null = null;
  if (obj.modelVariant) {
    modelVariant = await prisma.modelVariant.findFirst({
      where: {
        modelId: model.id,
        name: { equals: obj.modelVariant, mode: "insensitive" },
      },
    });

    if (!modelVariant) {
      modelVariant = await prisma.$transaction(async () => {
        await prisma.$executeRaw`LOCK TABLE "model_variant" IN EXCLUSIVE MODE`;

        return await prisma.modelVariant.create({
          data: {
            name: obj.modelVariant as string,
            model: { connect: { id: model.id } },
            yearStart: obj.year,
            yearEnd: obj.year,
          },
        });
      });
    }
  }

  return {
    year: obj.year,
    make: make.name,
    model: model.name,
    modelVariant: modelVariant?.name || null,
    makeId: make.id,
    modelId: model.id,
    modelVariantId: modelVariant?.id || null,
  };
}
