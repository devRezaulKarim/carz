"use server";

import {
  StreamableValue,
  createAI,
  createStreamableUI,
  createStreamableValue,
} from "ai/rsc";
import { type CoreMessage, generateObject, type UserContent } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ReactNode } from "react";
import {
  StreamableSkeleton,
  StreamableSkeletonProps,
} from "@/components/admin/classifieds/streamable-skeleton";
import {
  classifiedDetailsAISchema,
  classifiedTaxonomyAISchema,
} from "@/schemas/classified-ai-schema";
import { mapToiTaxonomyOrCreate } from "@/lib/ai-utls";
import { prisma } from "../../prisma/prisma";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
});

export type ServerMessage = {
  id?: number;
  name?: string;
  role: "user" | "assistant" | "system";
  content: UserContent;
};

export type ClientMessage = {
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
  classified: StreamableValue<StreamableSkeletonProps>;
};

export const generateClassified = async (
  image: string,
): Promise<ClientMessage | null> => {
  const uiStream = createStreamableUI();
  const valueStream = createStreamableValue<StreamableSkeletonProps>();
  let classified = { image } as StreamableSkeletonProps;

  uiStream.update(<StreamableSkeleton {...classified} />);

  // async function processEvent() {
  //   const { object: taxonomy } = await generateObject({
  //     model: openai("gpt-4o-2024-11-20", {
  //       structuredOutputs: true,
  //     }),
  //     schema: classifiedTaxonomyAISchema,
  //     system:
  //       "You are an expert at analyzing images of vehicles and responding with a structured JSON object based on the schema provided.",
  //     messages: [
  //       {
  //         role: "user",
  //         content: [
  //           { type: "image", image },
  //           {
  //             type: "text",
  //             text: "You are tasked with returning the structured data for the vehicle in the image attached",
  //           },
  //         ],
  //       },
  //     ] as CoreMessage[],
  //   });

  //   classified.title =
  //     `${taxonomy.year} ${taxonomy?.make} ${taxonomy?.model} ${taxonomy?.modelVariant ? taxonomy.modelVariant : ""}`.trim();

  //   const foundTaxonomy = await mapToiTaxonomyOrCreate({
  //     year: taxonomy.year,
  //     make: taxonomy.make,
  //     model: taxonomy.model,
  //     modelVariant: taxonomy.modelVariant,
  //   });

  //   if (foundTaxonomy) {
  //     const make = await prisma.make.findFirst({
  //       where: { name: foundTaxonomy.make },
  //     });

  //     if (make) {
  //       classified = {
  //         ...classified,
  //         ...foundTaxonomy,
  //         make,
  //         makeId: make.id,
  //       };
  //     }
  //   }
  //   uiStream.update(<StreamableSkeleton done={true} {...classified} />);
  //   valueStream.update(classified);
  //   uiStream.done();
  //   valueStream.done();
  // }
  async function processEvent() {
    try {
      const { object: taxonomy } = await generateObject({
        model: openai("gpt-4o-2024-11-20", {
          structuredOutputs: true,
        }),
        schema: classifiedTaxonomyAISchema,
        system:
          "You are an expert at analyzing images of vehicles and responding with a structured JSON object based on the schema provided.",
        messages: [
          {
            role: "user",
            content: [
              { type: "image", image },
              {
                type: "text",
                text: "You are tasked with returning the structured data for the vehicle in the image attached",
              },
            ],
          },
        ] as CoreMessage[],
      });

      classified.title =
        `${taxonomy.year} ${taxonomy?.make} ${taxonomy?.model} ${
          taxonomy?.modelVariant ? taxonomy.modelVariant : ""
        }`.trim();

      const foundTaxonomy = await mapToiTaxonomyOrCreate({
        year: taxonomy.year,
        make: taxonomy.make,
        model: taxonomy.model,
        modelVariant: taxonomy.modelVariant,
      });

      if (foundTaxonomy) {
        const make = await prisma.make.findFirst({
          where: { name: foundTaxonomy.make },
        });

        if (make) {
          classified = {
            ...classified,
            ...foundTaxonomy,
            make,
            makeId: make.id,
          };
        }
      }

      uiStream.update(<StreamableSkeleton {...classified} />);

      const { object: details } = await generateObject({
        model: openai("gpt-4o-mini-2024-07-18", { structuredOutputs: true }),
        schema: classifiedDetailsAISchema,
        system:
          "You are an expert at writing vehicle descriptions and generating structured data",
        messages: [
          {
            role: "user",
            content: [
              { type: "image", image },
              {
                type: "text",
                text: `Based on the image provided, you are tasked with determining the odometer reading, doors, seats, ULEZ compliance, transmission, color, fuel type, body type, drive type, VRM and any addition details in the schema provided for the ${classified.title}. You must be accurate when determining the values for these properties even if the image is not clear.`,
              },
            ],
          },
        ] as CoreMessage[],
      });

      classified = {
        ...classified,
        ...details,
      };

      uiStream.update(<StreamableSkeleton done={true} {...classified} />);
      valueStream.update(classified);
    } catch (error: unknown) {
      let errorMessage = "";
      if (error?.stack?.includes("You exceeded your current quota")) {
        errorMessage =
          "You exceeded your current quota, please check your plan and billing details. For now you can proceed manually.";
      } else
        errorMessage =
          "Something went wrong, please try again later. For now you can proceed manually.";

      uiStream.update(
        <StreamableSkeleton {...classified} done={true} error={errorMessage} />,
      );
      valueStream.update({ ...classified, error: errorMessage });
    } finally {
      uiStream.done();
      valueStream.done();
    }
  }
  processEvent();

  return {
    id: Date.now(),
    display: uiStream.value,
    role: "assistant",
    classified: valueStream.value,
  };
};

export const AI = createAI({
  initialAIState: [] as ServerMessage[],
  initialUIState: [] as ClientMessage[],
  actions: { generateClassified },
});
