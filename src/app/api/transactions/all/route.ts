import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'
import { getPageSession } from "auth/lucia";

const prisma = new PrismaClient()

async function main(date: Date) {
  return await prisma.weeklyFigure.findMany({
    where: {
      week_start: date
    }
  })
}

export const POST = async (request: NextRequest) => {
  const session = await getPageSession();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = await request.json();
  const date = data.account;

  try {
    const transactions = await main(date)
    return new Response(JSON.stringify(transactions), {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error fetching transactions"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}