import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(date: Date) {
  return await prisma.account.findMany({
    select: {
      id: true,
      user: true,
      website: true,
      username: true,
      password: true,
      ip_location: true,
      credit_line: true,
      max_win: true,
      weeklyFigures: {
        where: {
          date: date,
        },
      },
    },
    orderBy: {
      user: {
        username: "asc",
      },
    },
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const date = data.date;
  try {
    const accounts = await main(date)
    return new Response(JSON.stringify(accounts), {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error fetching accounts"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}