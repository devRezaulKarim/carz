"use server";

import { auth, signOut } from "@/auth";
import { routes } from "@/config/routes";
import { prisma } from "../../prisma/prisma";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const session = await auth();
  if (session) {
    await signOut({
      redirect: true,
      redirectTo: routes.signIn,
    });
  }
};

export const logoutOfAllSessions = async () => {
  const session = await auth();
  if (session) {
    await prisma.session.deleteMany({ where: { userId: session.user?.id } });
    redirect(routes.signIn);
  }
};
