import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(date: Date, username: string) {
  return await prisma.account.findMany({
    where: {
      user: {
        username: username
      }
    },
    include: {
      user:true,
      weeklyFigures: {
        where: {
          week_start: date,
        },
        include: {
          adjustments: true,
        },
      },
    },
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const date = data.date;
  const username = data.username;

  try {
    const accounts = await main(date, username)
    return new Response(JSON.stringify(accounts), {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error fetching account"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}