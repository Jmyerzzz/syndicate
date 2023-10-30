import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'
import { getPageSession } from "auth/lucia";

const prisma = new PrismaClient()

async function main(userId: string) {
  return await prisma.user.findMany({
    where: {
      id: userId
    }
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const userId = data.userId;
  try {
    const user = await main(userId)
    return new Response(JSON.stringify(user[0]), {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error fetching user"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}