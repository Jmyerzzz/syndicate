import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'
import ObjectID from 'bson-objectid';

const prisma = new PrismaClient()

async function main(currentAmount: number, account: any, weeklyFigureId: string, figureData: any, date: Date) {
  let newAmount;
  const existingWeeklyFigure = await prisma.weeklyFigure.findUnique({
    where: {
      id: weeklyFigureId,
    },
  });

  if(existingWeeklyFigure) {
    if (figureData.operation === "debit") {
      newAmount = currentAmount - figureData.amount;
    } else if (figureData.operation === "credit") {
      newAmount = currentAmount + figureData.amount;
    }

    return await prisma.weeklyFigure.update({
      where: {
        id: existingWeeklyFigure.id
      },
      data: {
        account_id: account.id,
        amount: parseFloat(newAmount),
        date: date,
      },
    })
  } else {
    return await prisma.weeklyFigure.create({
      data: {
        id: new ObjectID().toString(),
        account_id: account.id,
        amount: parseFloat(figureData.amount),
        date: date,
      },
    })
  }
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const currentAmount = data.currentAmount;
  const account = data.account;
  const weeklyFigureId = data.weeklyFigureId;
  const figureData = data.figureData;
  const date = data.date;

  try {
    await main(currentAmount, account, weeklyFigureId, figureData, date)
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error creating/updating weekly figure"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}