import { Skeleton } from "@/components/ui/skeleton";
import {
  formatBodyType,
  formatColor,
  formatFuelType,
  formatNumber,
  formatOdoUnit,
  formatTransmission,
  formatULEZCompliance,
} from "@/lib/utils";
import { ClassifiedAI } from "@/schemas/classified-ai-schema";
import { Make } from "@prisma/client";
import {
  CarFront,
  CarIcon,
  CheckIcon,
  Fingerprint,
  FuelIcon,
  GaugeIcon,
  PowerIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";

export type StreamableSkeletonProps = Partial<Omit<ClassifiedAI, "make">> & {
  make?: Make;
  done?: boolean;
  error?: string;
};
export const StreamableSkeleton = ({
  image,
  title,
  odoReading,
  fuelType,
  transmission,
  description,
  bodyType,
  seats,
  doors,
  ulezCompliance,
  color,
  vrm,
  odoUnit,
  make,
  done,
  error,
}: StreamableSkeletonProps) => {
  return (
    <div className="container mx-auto flex flex-col py-12">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/2">
          {image ? (
            <Image
              src={image}
              alt={title || "Vehicle Image"}
              width={600}
              height={400}
              className="aspect-[3/2] rounded-lg object-cover"
            />
          ) : (
            <Skeleton className="aspect-[3/2] w-full" />
          )}
        </div>
        <div className="mt-4 md:mt-0 md:w-1/2 md:pl-8">
          <div className="flex flex-col items-start md:flex-row md:items-center">
            {make ? (
              <Image
                src={make?.image}
                alt={make?.name}
                width={80}
                height={64}
                className="mr-4"
              />
            ) : !done ? (
              <Skeleton className="mr-4 h-16 w-20" />
            ) : null}
            <div>
              {title ? (
                <h1 className="text-2xl font-bold">{title}</h1>
              ) : (
                <Skeleton className="mb-2 h-8 w-64" />
              )}
            </div>
          </div>
          <div className="my-4 flex flex-wrap items-center gap-2">
            {odoReading && odoUnit ? (
              <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
                {formatNumber(odoReading)} {formatOdoUnit(odoUnit)}
              </span>
            ) : !done ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : null}
            {fuelType ? (
              <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
                {formatFuelType(fuelType)}
              </span>
            ) : !done ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : null}
            {color ? (
              <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
                {formatColor(color)}
              </span>
            ) : !done ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : null}
            {transmission ? (
              <span className="rounded-md bg-gray-200 px-[10px] py-[2px] text-sm font-medium text-gray-800">
                {formatTransmission(transmission)}
              </span>
            ) : !done ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : null}
          </div>
          {description ? (
            <p className="mb-4 text-gray-600">{description}</p>
          ) : (
            <Skeleton className="mb-4 h-20 w-full" />
          )}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              {ulezCompliance === "EXEMPT" ? (
                <CheckIcon className="mx-auto !h-6 !w-6 text-green-500" />
              ) : (
                <XIcon className="mx-auto !h-6 !w-6 text-red-500" />
              )}
              {ulezCompliance ? (
                <p className="mt-2 text-sm font-medium">
                  {formatULEZCompliance(ulezCompliance)}
                </p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              <Fingerprint className="mx-auto !h-6 !w-6 text-zinc-400" />
              {vrm ? (
                <p className="mt-2 text-sm font-medium">{vrm}</p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              <CarIcon className="mx-auto !h-6 !w-6 text-zinc-400" />
              {bodyType ? (
                <p className="mt-2 text-sm font-medium">
                  {formatBodyType(bodyType)}
                </p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              <FuelIcon className="mx-auto !h-6 !w-6 text-zinc-400" />
              {fuelType ? (
                <p className="mt-2 text-sm font-medium">
                  {formatFuelType(fuelType)}
                </p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              <PowerIcon className="mx-auto !h-6 !w-6 text-zinc-400" />
              {transmission ? (
                <p className="mt-2 text-sm font-medium">
                  {formatTransmission(transmission)}
                </p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              <GaugeIcon className="mx-auto !h-6 !w-6 text-zinc-400" />
              {odoReading && odoUnit ? (
                <p className="mt-2 text-sm font-medium">
                  {formatNumber(odoReading)} {formatOdoUnit(odoUnit)}
                </p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              <UsersIcon className="mx-auto !h-6 !w-6 text-zinc-400" />
              {seats ? (
                <p className="mt-2 text-sm font-medium">{seats}</p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
            <div className="shadow-xs rounded-lg bg-gray-100 p-4 text-center">
              <CarFront className="mx-auto !h-6 !w-6 text-zinc-400" />
              {doors ? (
                <p className="mt-2 text-sm font-medium">{doors}</p>
              ) : !done ? (
                <Skeleton className="mx-auto mt-2 h-4 w-16" />
              ) : (
                <p className="mt-2 text-sm font-medium">UNKNOWN</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
