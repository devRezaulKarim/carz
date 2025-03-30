import {
  BodyType,
  ClassifiedStatus,
  Color,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { z } from "zod";

export const ClassifiedFilterSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minReading: z.string().optional(),
  maxReading: z.string().optional(),
  currency: z.string().optional(),
  odoUnit: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  color: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  ulezCompliance: z.string().optional(),
});

export const updateClassifiedSchema = z.object({
  id: z.number(),
  year: z.string(),
  make: z.string(),
  model: z.string(),
  modelVariant: z.string().optional(),
  description: z.string(),
  vrm: z.string(),
  odoReading: z.number(),
  doors: z.number(),
  seats: z.number(),
  price: z.number(),
  currency: z.nativeEnum(CurrencyCode, { message: "Invalid Currency Code" }),
  ulezCompliance: z.nativeEnum(ULEZCompliance, {
    message: "Invalid ULEZ Compliance",
  }),
  transmission: z.nativeEnum(Transmission, { message: "Invalid Transmission" }),
  color: z.nativeEnum(Color, { message: "Invalid Color" }),
  fuelType: z.nativeEnum(FuelType, { message: "Invalid Fuel Type" }),
  bodyType: z.nativeEnum(BodyType, { message: "Invalid Body Type" }),
  odoUnit: z.nativeEnum(OdoUnit, { message: "Invalid Odo Unit" }),
  status: z.nativeEnum(ClassifiedStatus),
  images: z.array(
    z.object({
      id: z.number().optional(),
      src: z.string().url(),
      alt: z.string(),
      uuid: z.string().uuid().optional(),
      base64: z.string().optional(),
      done: z.boolean().optional(),
    }),
  ),
});

export type UpdateClassifiedType = z.infer<typeof updateClassifiedSchema>;
