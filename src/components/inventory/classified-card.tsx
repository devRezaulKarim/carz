"use client";
import { routes } from "@/config/routes";
import { ClassifiedWithImage, MultiStepFormEnum } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HTMLParser from "../shared/html-parser";
import { Cog, Fuel, GaugeCircle, Paintbrush } from "lucide-react";
import { Button } from "../ui/button";
import { FavoriteButton } from "./favorite-button";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { formatNumber, formatPrice } from "@/lib/utils";

interface ClassifiedCardProps {
  classified: ClassifiedWithImage;
  favorites: number[];
}

const getKeyClassifiedInfo = (classified: ClassifiedWithImage) => {
  return [
    {
      id: "odoReading",
      icon: <GaugeCircle className="h-4 w-4" />,
      value: `${formatNumber(classified?.odoReading)} ${classified?.odoUnit === "MILES" ? "mi" : "km"}`,
    },
    {
      id: "transmission",
      icon: <Cog className="h-4 w-4" />,
      value: classified?.transmission.toLowerCase(),
    },
    {
      id: "fuelType",
      icon: <Fuel className="h-4 w-4" />,
      value: classified?.fuelType.toLowerCase(),
    },
    {
      id: "color",
      icon: <Paintbrush className="h-4 w-4" />,
      value: classified?.color.toLowerCase(),
    },
  ];
};

const ClassifiedCard = ({ classified, favorites }: ClassifiedCardProps) => {
  const pathname = usePathname();
  const [isFavorite, setIsFavorite] = useState(
    favorites.includes(classified.id),
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isFavorite && pathname === routes.favorites) {
      setIsVisible(false);
    }
  }, [pathname, isFavorite]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative flex flex-col overflow-hidden rounded-md bg-white shadow-md"
        >
          <div className="relative aspect-[3/2]">
            <Link href={routes.singleClassified(classified.slug)}>
              <Image
                placeholder="blur"
                blurDataURL={classified.images[0].blurhash}
                src={classified.images[0].src}
                alt={classified.images[0].alt}
                fill={true}
                sizes="500px"
                quality={25}
              />
            </Link>
            <FavoriteButton
              isFavorite={isFavorite}
              setIsFavorite={setIsFavorite}
              id={classified.id}
            />
            <div className="absolute right-[14px] top-[10px] rounded bg-primary px-2 py-1 font-bold text-slate-50">
              <p className="text-xs font-semibold lg:text-base">
                {formatPrice({
                  price: Number(classified.price),
                  currency: classified.currency,
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-3 p-4">
            <Link
              href={routes.singleClassified(classified.slug)}
              className="line-clamp-1 text-sm font-semibold transition-colors hover:text-primary md:text-base lg:text-lg"
            >
              {classified.title}
            </Link>
            {classified.description && (
              <div className="line-clamp-2 text-xs text-gray-500 md:text-sm xl:text-base">
                <HTMLParser html={classified.description} />
                &nbsp;{" "}
                {/* used to equalize the spacing for each card in the grid*/}
              </div>
            )}
            <ul className="grid w-full grid-cols-1 grid-rows-4 items-center justify-between text-xs text-gray-600 md:grid-cols-2 md:grid-rows-2 md:text-sm xl:flex">
              {getKeyClassifiedInfo(classified)
                .filter((val) => val)
                .map(({ id, icon, value }) => (
                  <li
                    key={id}
                    className={`flex items-center gap-[6px] font-semibold xl:flex-col ${id !== "odoReading" ? "capitalize" : ""}`}
                  >
                    {icon} {value}
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex w-full flex-col space-y-2 p-4 lg:flex-row lg:gap-x-2 lg:space-y-0">
            <Button
              className="h-full flex-1 py-2 text-xs transition-colors hover:border-white hover:bg-primary hover:text-white md:text-sm lg:py-2 xl:text-base"
              asChild
              variant="outline"
              size="sm"
            >
              <Link
                href={routes.reserve(
                  classified.slug,
                  MultiStepFormEnum.WELCOME,
                )}
              >
                Reserve
              </Link>
            </Button>
            <Button
              className="h-full flex-1 py-2 text-xs md:text-sm lg:py-2 xl:text-base"
              asChild
              size="sm"
            >
              <Link href={routes.singleClassified(classified.slug)}>
                View details
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClassifiedCard;
