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
    redirect(routes.admin.editClassifieds(classifiedId));
  } else {
    return { success: false, message: "Failed to create classified" };
  }
};
