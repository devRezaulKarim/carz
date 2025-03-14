import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";

export const GET = async (req: NextRequest) => {
  const params = new URL(req.url).searchParams;
  try {
    const makes = await prisma.make.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    let models: { id: number; name: string }[] = [];
    if (params.get("make")) {
      models = await prisma.model.findMany({
        select: { id: true, name: true },
        where: { makeId: Number(params.get("make")) },
        orderBy: { name: "asc" },
      });
    }

    let modelVariants: { id: number; name: string }[] = [];
    if (params.get("make") && params.get("model")) {
      modelVariants = await prisma.modelVariant.findMany({
        select: { id: true, name: true },
        where: { modelId: Number(params.get("model")) },
        orderBy: { name: "asc" },
      });
    }

    const lvMakes = makes.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));
    const lvModels = models.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));
    const lvModelVariants = modelVariants.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));
    return NextResponse.json(
      {
        makes: lvMakes,
        models: lvModels,
        modelVariants: lvModelVariants,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error.message, { status: 400 });
    }
    return NextResponse.json("Internal server error", { status: 500 });
  }
};
