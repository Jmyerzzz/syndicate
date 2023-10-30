import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'
import ObjectID from 'bson-objectid';
import { getPageSession } from "auth/lucia";

const prisma = new PrismaClient()

async function main(weeklyFigure: any, adjustmentData: any, date: Date) {
  let newAmount: number;
  const amount = adjustmentData.amount;

  if (adjustmentData.zero_out) {
    newAmount = parseFloat(weeklyFigure.amount) - parseFloat(amount);
  } else {
    if (adjustmentData.operation === "debit") {
      newAmount = 0 - parseFloat(amount);
    } else if (adjustmentData.operation === "credit") {
      newAmount = 0 + parseFloat(amount);
    }
  }

  return await prisma.adjustment.create({
    data: {
      id: new ObjectID().toString(),
      figure_id: weeklyFigure.id,
      amount: newAmount!,
      operation: adjustmentData.operation,
      zero_out: adjustmentData.zero_out,
      transaction_date: new Date(),
      week_start: date
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
  const weeklyFigure = data.weeklyFigure;
  const adjustmentData = data.adjustmentData;
  const date = data.date

  try {
    await main(weeklyFigure, adjustmentData, date)
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