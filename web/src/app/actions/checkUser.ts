"use server";
import { nextAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

export const checkUser = async () => {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user?.email) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email!,
      },
    });

    if (!user) {
      return null;
    }

    return { id: user.id, email: user.email };
  } catch (error) {
    return null;
  }
};

export const checkSession = async () => {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user?.email || !session.user.id) {
      return null;
    }

    return { id: session.user.id, email: session.user.email };
  } catch (error) {
    return null;
  }
};
