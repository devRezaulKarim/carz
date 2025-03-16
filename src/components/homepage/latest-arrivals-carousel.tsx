"use client";

import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { ClassifiedCardSkeleton } from "../inventory/classified-card-skeleton";
import { Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import ClassifiedCard from "../inventory/classified-card";
import { SwiperButtons } from "../shared/swiper-buttons";
import "swiper/css";

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ClassifiedCardSkeleton key={i} />
      ))}
    </div>
  ),
});

interface CarouselProps {
  classifieds: Prisma.ClassifiedGetPayload<{ include: { images: true } }>[];
  favorites: number[];
}

export const LatestArrivalsCarousel = ({
  classifieds,
  favorites,
}: CarouselProps) => {
  return (
    <div className="relative mt-8">
      <Swiper
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        pagination={{ clickable: true }}
        modules={[Navigation]}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1536: {
            slidesPerView: 4,
          },
        }}
      >
        {classifieds.map((classified) => (
          <SwiperSlide key={classified.id}>
            <ClassifiedCard classified={classified} favorites={favorites} />
          </SwiperSlide>
        ))}
      </Swiper>
      <SwiperButtons
        prevClassName="-left-16 border border-2 border-border  lg:flex hidden"
        nextClassName="-right-16 border border-2 border-border  lg:flex hidden"
      />
    </div>
  );
};
