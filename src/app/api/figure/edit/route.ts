import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getPageSession } from "auth/lucia";

const prisma = new PrismaClient();

async function main(
  account: any,
  figureData: any,
  figureId: string,
  action: boolean | undefined,
  date: Date
) {
  let newAmount: number;
  const amount = figureData.amount;

  if (action !== undefined) {
    return await prisma.weeklyFigure.update({
      where: {
        id: figureId,
      },
      data: {
        account_id: account.id,
        amount: newAmount!,
        action: action,
        transaction_date: new Date(),
        week_start: date,
      },
    });
  }

  if (figureData.operation === "debit") {
    newAmount = 0 - parseFloat(amount);
  } else if (figureData.operation === "credit") {
    newAmount = 0 + parseFloat(amount);
  }

  return await prisma.weeklyFigure.update({
    where: {
      id: figureId,
    },
    data: {
      account_id: account.id,
      amount: newAmount!,
      transaction_date: new Date(),
      week_start: date,
    },
  });
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
  const figureId = data.figureId;
  const action = data.action;
  const date = data.date;

  try {
    await main(account, figureData, figureId, action, date);
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Error creating weekly figure",
      },
      {
        status: 400,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};
