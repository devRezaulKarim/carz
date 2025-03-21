import { AwaitedPageProps } from "@/config/types";
import { ClassifiedFilterSchema } from "@/schemas/classified.schema";
import {
  BodyType,
  ClassifiedStatus,
  Color,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Prisma,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (
  num: number | null,
  options?: Intl.NumberFormatOptions,
) => {
  if (!num) return "0";
  return new Intl.NumberFormat("en-US", options).format(num);
};

export const formatPrice = ({
  price,
  currency,
}: {
  price: number | null;
  currency: CurrencyCode | null;
}) => {
  if (!price) return "0";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
    ...(currency && { currency }),
  });

  return formatter.format(price / 100);
};

export const formatOdoUnit = (odoUnit: OdoUnit) => {
  switch (odoUnit) {
    case OdoUnit.MILES:
      return "mi";
    case OdoUnit.KILOMETERS:
      return "km";

    default:
      return "Unknown";
  }
};
export const formatTransmission = (transmission: Transmission) => {
  switch (transmission) {
    case Transmission.MANUAL:
      return "Manual";
    case Transmission.AUTOMATIC:
      return "Automatic";

    default:
      return "Unknown";
  }
};
export const formatFuelType = (fuelType: FuelType) => {
  switch (fuelType) {
    case FuelType.PETROL:
      return "Petrol";
    case FuelType.DIESEL:
      return "Diesel";
    case FuelType.ELECTRIC:
      return "Electric";
    case FuelType.HYBRID:
      return "Hybrid";

    default:
      return "Unknown";
  }
};

export const formatBodyType = (bodyType: BodyType) => {
  switch (bodyType) {
    case BodyType.SEDAN:
      return "Sedan";
    case BodyType.HATCHBACK:
      return "Hatchback";
    case BodyType.SUV:
      return "SUV";
    case BodyType.COUPE:
      return "Coupe";
    case BodyType.CONVERTIBLE:
      return "Convertible";
    case BodyType.WAGON:
      return "Wagon";

    default:
      return "Unknown";
  }
};

export const formatColor = (color: Color) => {
  switch (color) {
    case Color.BLACK:
      return "Black";
    case Color.BLUE:
      return "Blue";
    case Color.BROWN:
      return "Brown";
    case Color.GOLD:
      return "Gold";
    case Color.GREEN:
      return "Green";
    case Color.GREY:
      return "Grey";
    case Color.ORANGE:
      return "Orange";
    case Color.PINK:
      return "Pink";
    case Color.PURPLE:
      return "Purple";
    case Color.SILVER:
      return "Silver";
    case Color.WHITE:
      return "White";
    case Color.YELLOW:
      return "Yellow";
    default:
      return "Unknown";
  }
};

export const formatULEZCompliance = (ulezCompliance: ULEZCompliance) => {
  switch (ulezCompliance) {
    case ULEZCompliance.EXEMPT:
      return "Exempt";
    case ULEZCompliance.NON_EXEMPT:
      return "Non Exempt";

    default:
      return "Unknown";
  }
};

export const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined,
): Prisma.ClassifiedWhereInput => {
  const { data } = ClassifiedFilterSchema.safeParse(searchParams);
  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data);

  const taxonomyFilters = ["make", "model", "modelVariant"];
  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReading: "odoReading",
  };
  const numFilters = ["seats", "doors"];
  const enumFilters = [
    "odoUnit",
    "currency",
    "transmission",
    "bodyType",
    "fuelType",
    "color",
    "ulezCompliance",
  ];

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined;
      if (!value) return acc;

      if (taxonomyFilters.includes(key)) {
        acc[key] = { id: Number(value) };
      } else if (enumFilters.includes(key)) {
        acc[key] = value.toUpperCase();
      } else if (numFilters.includes(key)) {
        acc[key] = Number(value);
      } else if (key in rangeFilters) {
        const field = rangeFilters[key as keyof typeof rangeFilters];
        acc[field] = acc[field] || {};
        if (key.startsWith("min")) {
          acc[field].gte = Number(value);
        } else if (key.startsWith("max")) {
          acc[field].lte = Number(value);
        }
      }

      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as { [key: string]: any },
  );

  return {
    status: ClassifiedStatus.LIVE,
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),
    ...mapParamsToFields,
  };
};

export const generateDateOptions = () => {
  const today = new Date();
  const dates = [];
  for (let day = 0; day <= 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    dates.push({
      label: format(date, "dd MMM yyyy"),
      value: format(date, "dd MMM yyyy"),
    });
  }
  return dates;
};

export const generateTimeOptions = () => {
  const times = [];
  const startHour = 10;
  const endHour = 20;
  for (let hour = startHour; hour <= endHour; hour++) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(hour);
    date.setMinutes(0);
    const formattedTime = date.toLocaleTimeString("en-BN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    times.push({
      label: formattedTime,
      value: formattedTime,
    });
  }
  return times;
};

export const formatDate = (date: string, time: string) => {
  const parsedDate = parse(date, "dd MMM yyyy", new Date());
  const parsedTime = parse(time, "hh:mm aa", new Date());

  parsedDate.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

  return parsedDate;
};

export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : current < 0 ? -100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};
