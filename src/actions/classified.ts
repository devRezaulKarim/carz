"use server";

import { auth } from "@/auth";
import { StreamableSkeletonProps } from "@/components/admin/classifieds/streamable-skeleton";
import { prisma } from "../../prisma/prisma";
import slugify from "slugify";
import { randomInt } from "node:crypto";
import { generateThumbHash } from "@/lib/thumbhash-server";
import { createPngDataUri } from "unlazy/thumbhash";
import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";
import { UpdateClassifiedType } from "@/schemas/classified.schema";

export const createClassifiedAction = async (data: StreamableSkeletonProps) => {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  let success = false;
  let classifiedId: number | null = null;
  try {
    const make = await prisma.make.findUnique({
      where: {
        id: data.makeId as number,
      },
    });
    const model = await prisma.model.findUnique({
      where: {
        id: data.modelId as number,
      },
    });

    let title = `${data.year} ${make?.name} ${model?.name}`;

    if (data?.modelVariant) {
      const modelVariant = await prisma.modelVariant.findUnique({
        where: {
          id: data.modelVariantId as number,
        },
      });
      if (modelVariant) title = `${title} ${modelVariant.name}`;
    }

    let slug = slugify(`${title} ${data.vrm ?? randomInt(100000, 999999)}`);

    const slugLikeFound = await prisma.classified.count({
      where: { slug: { contains: slug, mode: "insensitive" } },
    });
    if (slugLikeFound)
      slug = slugify(`${title} ${data.vrm} ${slugLikeFound + 1}`);

    const thumbhash = await generateThumbHash(data.image as string);
    const uri = createPngDataUri(thumbhash);

    const classified = await prisma.classified.create({
      data: {
        slug,
        title,
        year: Number(data.year),
        makeId: data.makeId as number,
        modelId: data.modelId as number,
        ...(data.modelVariantId && {
          modelVariantId: data.modelVariantId as number,
        }),
        vrm: data?.vrm ? data.vrm : null,
        price: 0,
        currency: "USD",
        odoReading: data.odoReading,
        odoUnit: data.odoUnit,
        bodyType: data.bodyType,
        fuelType: data.fuelType,
        color: data.color,
        transmission: data.transmission,
        ulezCompliance: data.ulezCompliance,
        description: data.description,
        doors: data.doors,
        seats: data.seats,
        images: {
          create: {
            isMain: true,
            blurhash: uri,
            src: data.image as string,
            alt: title,
          },
        },
      },
    });

    if (classified) {
      classifiedId = classified.id;
      success = true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }

  if (success && classifiedId) {
    revalidatePath(routes.admin.classifieds);
    redirect(routes.admin.editClassified(classifiedId));
  } else {
    return { success: false, message: "Failed to create classified" };
  }
};

export const updateClassifiedAction = async (data: UpdateClassifiedType) => {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  let success = false;

  try {
    const makeId = Number(data.make);
    const modelId = Number(data.model);
    const modelVariantId = data.modelVariant ? Number(data.modelVariant) : null;

    const make = await prisma.make.findUnique({
      where: {
        id: makeId,
      },
    });
    const model = await prisma.model.findUnique({
      where: {
        id: modelId,
      },
    });

    let title = `${data.year} ${make?.name} ${model?.name}`;

    if (modelVariantId) {
      const modelVariant = await prisma.modelVariant.findUnique({
        where: {
          id: modelVariantId,
        },
      });
      if (modelVariant) title = `${title} ${modelVariant.name}`;
    }

    const slug = slugify(`${title} ${data.vrm}`);

    const [classified, images] = await prisma.$transaction(
      async () => {
        await prisma.image.deleteMany({
          where: { classifiedId: data.id },
        });

        const imageData = await Promise.all(
          data.images.map(async ({ src }, index) => {
            const hash = await generateThumbHash(src);
            const uri = createPngDataUri(hash);
            return {
              classifiedId: data.id,
              isMain: !index,
              blurhash: uri,
              src,
              alt: `${title} ${index + 1}`,
            };
          }),
        );

        const images = await prisma.image.createManyAndReturn({
          data: imageData,
        });

        const classified = await prisma.classified.update({
          where: {
            id: data.id,
          },
          data: {
            slug,
            title,
            year: Number(data.year),
            makeId,
            modelId,
            ...(modelVariantId && { modelVariantId }),
            vrm: data.vrm,
            price: Number(data.price) * 100,
            currency: data.currency,
            odoReading: data.odoReading,
            odoUnit: data.odoUnit,
            bodyType: data.bodyType,
            fuelType: data.fuelType,
            color: data.color,
            transmission: data.transmission,
            ulezCompliance: data.ulezCompliance,
            description: data.description,
            doors: data.doors,
            seats: data.seats,
            status: data.status,
            images: {
              set: images.map((img) => ({ id: img.id })),
            },
          },
        });

        return [classified, images];
      },
      { timeout: 10000 },
    );
    if (classified && images) success = true;
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }

  if (success) {
    revalidatePath(routes.admin.classifieds);
    redirect(routes.admin.classifieds);
  } else {
    return { success: false, message: "Failed to update classified" };
  }
};

export const deleteClassifiedAction = async (id: number) => {
  try {
    await prisma.classified.delete({
      where: { id },
    });
    revalidatePath(routes.admin.classifieds);
    return { success: true, message: "Classified deleted successfully" };
  } catch (error) {
    if (error instanceof Error)
      return { success: false, message: error.message };

    return { success: true, message: "Something went wrong" };
  }
};
