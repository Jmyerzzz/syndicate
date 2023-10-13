import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'
import ObjectID from 'bson-objectid';

const prisma = new PrismaClient()

async function main(weeklyFigureId: string, adjustmentData: any, date: Date) {
  let newAmount;
  // const existingWeeklyFigure = await prisma.weeklyFigure.findUnique({
  //   where: {
  //     id: weeklyFigureId,
  //   },
  // });

  // if(existingWeeklyFigure) {
  //   if (figureData.operation === "debit") {
  //     newAmount = currentAmount - parseFloat(figureData.amount);
  //   } else if (figureData.operation === "credit") {
  //     newAmount = currentAmount + parseFloat(figureData.amount);
  //   }

  //   return await prisma.weeklyFigure.update({
  //     where: {
  //       id: existingWeeklyFigure.id
  //     },
  //     data: {
  //       account_id: account.id,
  //       amount: newAmount,
  //       date: date,
  //     },
  //   })
  // }

  if (adjustmentData.operation === "debit") {
    newAmount = 0 - parseFloat(adjustmentData.amount);
  } else if (adjustmentData.operation === "credit") {
    newAmount = 0 + parseFloat(adjustmentData.amount);
  }

  return await prisma.adjustment.create({
    data: {
      id: new ObjectID().toString(),
      figure_id: weeklyFigureId,
      amount: newAmount!,
      operation: adjustmentData.operation,
      date: date,
    },
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const weeklyFigureId = data.weeklyFigureId;
  const adjustmentData = data.adjustmentData;
  const date = data.date;

  try {
    await main(weeklyFigureId, adjustmentData, date)
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error creating adjustment"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}