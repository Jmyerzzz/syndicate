import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(account: any, figureData: any, figureId: string, date: Date) {
  let newAmount;
  const amount = figureData.amount;

  if (figureData.operation === "debit") {
    newAmount = 0 - parseFloat(amount);
  } else if (figureData.operation === "credit") {
    newAmount = 0 + parseFloat(amount);
  }

  return await prisma.weeklyFigure.update({
    where: {
      id: figureId
    },
    data: {
      account_id: account.id,
      amount: newAmount!,
      transaction_date: new Date(),
      week_start: date,
    },
  })
  
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const account = data.account;
  const figureData = data.figureData;
  const figureId = data.figureId;
  const date = data.date;

  try {
    await main(account, figureData, figureId, date)
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error creating weekly figure"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}