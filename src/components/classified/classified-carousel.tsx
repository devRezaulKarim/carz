"use client";
import { Image as prismaImage } from "@prisma/client";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/virtual";
import { EffectFade, Navigation, Thumbs, Virtual } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { Swiper as swiperType } from "swiper/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { SwiperButtons } from "../shared/swiper-buttons";
import { CarouselSkeleton } from "./carousel-skeleton";
import FsLightbox from "fslightbox-react";

interface ClassifiedCarouselProps {
  images: prismaImage[];
}
const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => <CarouselSkeleton />,
});
const SwiperThumb = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  {
    ssr: false,
    loading: () => null,
  },
);

export const ClassifiedCarousel = ({ images }: ClassifiedCarouselProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<swiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightBoxController, setLightBoxController] = useState({
    toggler: false,
    sourceIndex: 0,
  });

  const setSwiper = (swiper: swiperType) => {
    setThumbsSwiper(swiper);
  };
  const handleSlideChange = useCallback((swiper: swiperType) => {
    setActiveIndex(swiper.activeIndex);
  }, []);

  const handleImageClick = useCallback(() => {
    setLightBoxController({
      toggler: !lightBoxController.toggler,
      sourceIndex: activeIndex,
    });
  }, [activeIndex, lightBoxController.toggler]);

  const sources = images.map((img) => img.src);

  return (
    <>
      <FsLightbox
        toggler={lightBoxController.toggler}
        sourceIndex={lightBoxController.sourceIndex}
        sources={sources}
        type="image"
      />
      <div className="relative isolate">
        <Swiper
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          effect="fade"
          spaceBetween={10}
          fadeEffect={{ crossFade: true }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[EffectFade, Navigation, Thumbs, Virtual]}
          virtual={{
            addSlidesAfter: 8,
            enabled: true,
          }}
          onSlideChange={handleSlideChange}
          className="-z-10 aspect-[3/2]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} virtualIndex={index}>
              <Image
                onClick={handleImageClick}
                blurDataURL={image.blurhash}
                src={image.src}
                alt={image.alt}
                width={1200}
                height={800}
                placeholder="blur"
                className="mx-auto aspect-[3/2] cursor-pointer rounded-md object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperButtons
          prevClassName="left-4 bg-white"
          nextClassName="right-4 bg-white"
        />
        <SwiperThumb
          onSwiper={setSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[Navigation, Thumbs, EffectFade]}
        >
          {images.map((img) => (
            <SwiperSlide
              key={img.id}
              className="relative mt-2 h-fit w-full cursor-grab"
            >
              <Image
                className="aspect-[3/2] rounded-md object-cover"
                width={300}
                height={200}
                src={img.src}
                alt={img.alt}
                placeholder="blur"
                blurDataURL={img.blurhash}
              />
            </SwiperSlide>
          ))}
        </SwiperThumb>
      </div>
    </>
  );
};
