"use server";

import {
  CreateCustomerSchema,
  CreateCustomerType,
  UpdateCustomerSchema,
} from "@/schemas/customer.schema";
import { prisma } from "../../prisma/prisma";
import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";
import { CustomerStatus } from "@prisma/client";

export const createCustomerAction = async (props: CreateCustomerType) => {
  try {
    const { data, success, error } = CreateCustomerSchema.safeParse(props);
    if (!success) {
      console.log({ error });

      return {
        success: false,
        message: "Invalid data!",
      };
    }
    if (data.terms !== "true") {
      return {
        success: false,
        message: "You must accept the terms",
      };
    }
    const { date, terms, slug, ...rest } = data;
    await prisma.customer.create({
      data: {
        ...rest,
        bookingDate: date,
        termsAccepted: terms === "true",
        classified: { connect: { slug } },
      },
    });
    return {
      success: true,
      message: "Reservation successful!",
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
};

export const updateCustomerAction = async ({
  id,
  status,
}: {
  id: number;
  status: CustomerStatus;
}) => {
  const { data, success } = UpdateCustomerSchema.safeParse({ id, status });
  if (!success) return { success: false, message: "Invalid status" };

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: data.id },
    });

    if (!customer) return { success: false, message: "Customer not found" };

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        status: data.status,
        lifecycle: {
          create: {
            oldStatus: customer.status,
            newStatus: data.status,
          },
        },
      },
    });
    revalidatePath(routes.admin.customers);
    revalidatePath(routes.admin.editCustomer(customer.id));
    return { success: true, message: "Customer updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteCustomerAction = async (id: number) => {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    revalidatePath(routes.admin.customers);
    return { success: true, message: "Customer deleted successfully" };
  } catch (error) {
    if (error instanceof Error)
      return { success: false, message: error.message };

    return { success: true, message: "Something went wrong" };
  }
};
