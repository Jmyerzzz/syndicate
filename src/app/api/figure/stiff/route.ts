import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(weeklyFigureId: string, stiffed: boolean) {
  return await prisma.weeklyFigure.update({
    where: {
      id: weeklyFigureId
    },
    data: {
      stiffed: stiffed
    },
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const weeklyFigureId = data.weeklyFigureId;
  const stiffed = data.stiffed;

  try {
    await main(weeklyFigureId, stiffed)
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error marking weekly figure as stiffed"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}