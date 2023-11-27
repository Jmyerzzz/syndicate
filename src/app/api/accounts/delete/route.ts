import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getPageSession } from "auth/lucia";

const prisma = new PrismaClient();

async function main(accountId: any) {
  return await prisma.account.delete({
    where: {
      id: accountId,
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
  const accountId = data.accountId;

  try {
    await main(accountId);
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Error deleting account",
      },
      {
        status: 400,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};
