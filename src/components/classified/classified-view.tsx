import { Prisma, ULEZCompliance } from "@prisma/client";
import { ClassifiedCarousel } from "./classified-carousel";
import Image from "next/image";
import {
  formatBodyType,
  formatColor,
  formatFuelType,
  formatNumber,
  formatOdoUnit,
  formatPrice,
  formatTransmission,
  formatULEZCompliance,
} from "@/lib/utils";
import HTMLParser from "../shared/html-parser";
import { Button } from "../ui/button";
import Link from "next/link";
import { routes } from "@/config/routes";
import { MultiStepFormEnum } from "@/config/types";
import {
  CarFrontIcon,
  CarIcon,
  CheckIcon,
  Fingerprint,
  FuelIcon,
  GaugeIcon,
  PowerIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

type ClassifiedViewProps = Prisma.ClassifiedGetPayload<{
  include: { make: true; images: true };
}>;

const features = (props: ClassifiedViewProps) => [
  {
    id: 1,
    icon:
      props.ulezCompliance === ULEZCompliance.EXEMPT ? (
        <CheckIcon className="mx-auto !h-6 !w-6 text-green-500" />
      ) : (
        <XIcon className="mx-auto !h-6 !w-6 text-red-500" />
      ),
    label: formatULEZCompliance(props.ulezCompliance),
  },
  {
    id: 2,
    icon: <Fingerprint className="mx-auto !h-6 !w-6 text-gray-500" />,
    label: props.vrm,
  },
  {
    id: 3,
    icon: <CarIcon className="mx-auto !h-6 !w-6 text-gray-500" />,
    label: formatBodyType(props.bodyType),
  },
  {
    id: 4,
    icon: <FuelIcon className="mx-auto !h-6 !w-6 text-gray-500" />,
    label: formatFuelType(props.fuelType),
  },
  {
    id: 5,
    icon: <PowerIcon className="mx-auto !h-6 !w-6 text-gray-500" />,
    label: formatTransmission(props.transmission),
  },
  {
    id: 6,
    icon: <GaugeIcon className="mx-auto !h-6 !w-6 text-gray-500" />,
    label: `${formatNumber(props.odoReading)} ${formatOdoUnit(props.odoUnit)}`,
  },
  {
    id: 7,
    icon: <UsersIcon className="mx-auto !h-6 !w-6 text-gray-500" />,
    label: props.seats,
  },
  {
    id: 8,
    icon: <CarFrontIcon className="mx-auto !h-6 !w-6 text-gray-500" />,
    label: props.doors,
  },
];
export const ClassifiedView = (props: ClassifiedViewProps) => {
  return (
    <div className="container mx-auto flex flex-col px-4 py-12 md:px-0">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <ClassifiedCarousel images={props.images} />
        </div>
        <div className="mt-4 md:mt-0 md:w-1/2 md:pl-8">
          <div className="flex flex-col items-start md:flex-row md:items-center">
            <Image
              src={props.make.image}
              alt={props.make.name}
              className="mr-4 w-20"
              width={120}
              height={120}
            />
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{props.title}</h1>
            </div>
          </div>
          <div className="mb-2 mt-4 flex items-center space-x-2">
            <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
              {props.year}
            </span>
            <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
              {formatNumber(props.odoReading)} {formatOdoUnit(props.odoUnit)}
            </span>
            <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
              {formatColor(props.color)}
            </span>
            <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
              {formatFuelType(props.fuelType)}
            </span>
          </div>
          {props.description && (
            <div className="mb-4">
              <HTMLParser html={props.description} />
            </div>
          )}

          <div className="my-4 grid w-full place-items-center rounded-xl border border-slate-200 py-12 text-3xl font-bold">
            Our Price:{" "}
            {formatPrice({
              price: Number(props.price),
              currency: props.currency,
            })}
          </div>
          <Button
            asChild
            size="lg"
            className="mb-4 w-full rounded px-6 py-3 font-bold uppercase"
          >
            <Link
              className="tracking-widest"
              href={routes.reserve(props.slug, MultiStepFormEnum.WELCOME)}
            >
              Reserve Now
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {features(props).map(({ id, icon, label }) => (
              <div
                key={id}
                className="shadow-xs flex flex-col items-center rounded-lg bg-gray-100 p-4 text-center"
              >
                {icon}
                <p className="mt-2 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
