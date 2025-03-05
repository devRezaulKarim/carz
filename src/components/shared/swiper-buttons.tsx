import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const SwiperButtons = ({
  prevClassName,
  nextClassName,
}: {
  prevClassName: string;
  nextClassName: string;
}) => {
  return (
    <>
      <Button
        variant="ghost"
        type="button"
        rel="prev"
        size="icon"
        className={cn(
          "swiper-button-prev absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full",
          prevClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronLeft className="!h-6 !w-6" color="black" />
      </Button>
      <Button
        variant="ghost"
        type="button"
        rel="next"
        size="icon"
        className={cn(
          "swiper-button-next absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full",
          nextClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronRight className="!h-6 !w-6" color="black" />
      </Button>
    </>
  );
};
