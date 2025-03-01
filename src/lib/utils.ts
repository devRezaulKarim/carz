import {
  BodyType,
  Color,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
