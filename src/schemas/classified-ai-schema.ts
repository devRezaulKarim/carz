import {
  BodyType,
  Color,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { z } from "zod";

export const classifiedTaxonomyAISchema = z.object({
  year: z.number().describe("The year of the vehicle"),
  make: z.string().describe("The make of the vehicle"),
  makeId: z.number().nullable().describe("The make ID of the vehicle"),
  model: z.string().describe("The model of the vehicle"),
  modelId: z.number().nullable().describe("The model ID of the vehicle"),
  modelVariant: z
    .string()
    .nullable()
    .describe("The model variant of the vehicle"),
  modelVariantId: z
    .number()
    .nullable()
    .describe("The model variant ID of the vehicle"),
});

export const classifiedDetailsAISchema = z.object({
  description: z
    .string()
    .describe(
      "The description of the vehicle. Ensure it is less than or equal to 50 words and does not contains any HTML tags.",
    ),
  vrm: z
    .string()
    .describe(
      "The vehicle registration mark. If unable to detect use 'UNKNOWN'",
    ),
  odoReading: z.number().describe("The odometer reading of the vehicle"),
  doors: z.number().describe("The number of doors on the vehicle"),
  seats: z.number().describe("The number of seats in the vehicle"),
  ulezCompliance: z
    .nativeEnum(ULEZCompliance)
    .describe("The ULEZ Compliance status of the vehicle"),
  transmission: z
    .nativeEnum(Transmission)
    .describe("The transmission of the vehicle"),
  color: z.nativeEnum(Color).describe("The color of the vehicle"),
  fuelType: z.nativeEnum(FuelType).describe("The fuel type of the vehicle"),
  bodyType: z.nativeEnum(BodyType).describe("The body type of the vehicle"),
  odoUnit: z
    .nativeEnum(OdoUnit)
    .describe("The odometer unit type of the vehicle"),
});

export const classifiedAISchema = classifiedDetailsAISchema
  .merge(classifiedTaxonomyAISchema)
  .extend({
    title: z.string().describe("The title of the vehicle"),
    image: z.string().url().describe("The image of the vehicle"),
  });

export type ClassifiedAI = z.infer<typeof classifiedAISchema>;
