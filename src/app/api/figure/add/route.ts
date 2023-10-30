import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'
import ObjectID from 'bson-objectid';
import { getPageSession } from "auth/lucia";

const prisma = new PrismaClient()

async function main(account: any, figureData: any, date: Date) {
  let newAmount: number;
  const amount = figureData.amount;

  if (figureData.operation === "debit") {
    newAmount = 0 - parseFloat(amount);
  } else if (figureData.operation === "credit") {
    newAmount = 0 + parseFloat(amount);
  }

  return await prisma.weeklyFigure.create({
    data: {
      id: new ObjectID().toString(),
      account_id: account.id,
      amount: newAmount!,
      transaction_date: new Date(),
      week_start: date,
    },
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
  const account = data.account;
  const figureData = data.figureData;
  const date = data.date;

  try {
    await main(account, figureData, date)
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