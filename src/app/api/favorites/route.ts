import { routes } from "@/config/routes";
import { Favorites } from "@/config/types";
import { redis } from "@/lib/redis-store";
import { setSourceId } from "@/lib/source-id";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const validateIdSchema = z.object({ id: z.number().int() });

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { data, error } = validateIdSchema.safeParse(body);

  if (!data) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
  if (typeof data.id !== "number") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const sourceId = await setSourceId();

  const storedFavorites = await redis.get<Favorites>(sourceId);

  const favorites: Favorites = storedFavorites || { ids: [] };

  if (favorites.ids.includes(data.id)) {
    favorites.ids = favorites.ids.filter((favId) => favId !== data.id);
  } else {
    favorites.ids.push(data.id);
  }

  await redis.set(sourceId, favorites);
  revalidatePath(routes.favorites);

  return NextResponse.json({ ids: favorites.ids }, { status: 200 });
};
