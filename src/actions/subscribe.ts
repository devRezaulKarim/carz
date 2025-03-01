"use server";
import { db } from "../../prisma/db";
import { CustomerStatus, Prisma } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { subscribeSchema } from "@/schemas/subscriber.schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subscribeAction = async (_: any, formData: FormData) => {
  try {
    const { data, success, error } = subscribeSchema.safeParse({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    });

    if (!success) return { success: false, message: error.message };

    const subscriber = await db.customer.findFirst({
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

    await db.customer.create({ data: customerData });

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
