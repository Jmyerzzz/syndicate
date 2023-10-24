import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(accountData: any, accountId: any) {
  return await prisma.account.update({
    where: {
      id: accountId
    },
    data: {
      website: accountData.website,
      bookie: accountData.bookie,
      referral: accountData.referral,
      username: accountData.username,
      password: accountData.password,
      ip_location: accountData.ipLocation,
      credit_line: parseInt(accountData.creditLine),
      max_win: parseInt(accountData.maxWin),
      order: parseInt(accountData.order),
    },
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const accountData = data.accountData;
  const accountId = data.accountId;

  try {
    await main(accountData, accountId)
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error editing account"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}