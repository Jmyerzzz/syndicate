import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getPageSession } from "auth/lucia";

const prisma = new PrismaClient();

async function main(userId: string) {
  await prisma.key.delete({
    where: {
      user_id: userId,
    },
  });
  await prisma.session.delete({
    where: {
      user_id: userId,
    },
  });
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

export const POST = async (request: NextRequest) => {
  const session = await getPageSession();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = await request.json();
  const userId = data.userId;
  try {
    await main(userId);
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Error deleting user",
      },
      {
        status: 400,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};
