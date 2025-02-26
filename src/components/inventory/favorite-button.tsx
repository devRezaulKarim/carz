import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import { api } from "@/lib/api-client";
import { endpoints } from "@/config/endpoints";
import { useRouter } from "next/navigation";

type FavoriteButtonProps = {
  isFavorite: boolean;
  setIsFavorite: (isFavorite: boolean) => void;
  id: number;
};
export const FavoriteButton = ({
  id,
  isFavorite,
  setIsFavorite,
}: FavoriteButtonProps) => {
  const router = useRouter();

  const handleFavorite = async () => {
    const { ids } = await api.post<{ ids: number[] }>(endpoints.favorites, {
      json: { id },
    });

    setIsFavorite(!!ids.includes(id));
    setTimeout(() => router.refresh(), 250);
  };
  return (
    <Button
      onClick={handleFavorite}
      variant="ghost"
      size="icon"
      className={cn(
        "group absolute left-[14px] top-[10px] z-10 !h-6 !w-6 rounded-full lg:!h-8 lg:!w-8 xl:!h-10 xl:!w-10",
        isFavorite ? "bg-white" : "bg-muted/25",
      )}
    >
      <HeartIcon
        className={cn(
          "h-[14px] w-[14px] text-white transition-colors duration-200 ease-in-out lg:h-4 lg:w-4 xl:h-6 xl:w-6",
          isFavorite
            ? "fill-pink-500 text-pink-500"
            : "group-hover:fill-pink-500 group-hover:text-pink-500",
        )}
      />
    </Button>
  );
};
