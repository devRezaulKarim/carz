"use server";
import { prisma } from "../../prisma/prisma";
import { CustomerStatus, Prisma } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { subscribeSchema } from "@/schemas/subscriber.schema";
import { PrevState } from "@/config/types";

export const subscribeAction = async (_: PrevState, formData: FormData) => {
  try {
    const { data, success, error } = subscribeSchema.safeParse({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    });

    if (!success) return { success: false, message: error.message };

    const subscriber = await prisma.customer.findFirst({
      where: {
        email: data.email,
      },
    });
    if (subscriber) {
      return { success: false, message: "You are already subscriber!" };
    }

    const customerData: Prisma.CustomerCreateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      status: CustomerStatus.SUBSCRIBER,
      termsAccepted: true,
    };

    await prisma.customer.create({ data: customerData });

    return { success: true, message: "Subscribed successfully!" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { success: false, message: error.message };
    }
    if (error instanceof PrismaClientValidationError) {
      return { success: false, message: error.message };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong!" };
  }
};
