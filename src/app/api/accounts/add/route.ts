import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'
import ObjectID from 'bson-objectid';

const prisma = new PrismaClient()

async function main(user: any, accountData: any) {
  return await prisma.account.create({
    data: {
      id: new ObjectID().toString(),
      user_id: user.id,
      website: accountData.website,
      bookie: accountData.bookie,
      referral: accountData.referral,
      username: accountData.username,
      password: accountData.password,
      ip_location: accountData.ipLocation,
      credit_line: parseInt(accountData.creditLine),
      max_win: parseInt(accountData.maxWin),
    },
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const user = data.user;
  const accountData = data.accountData

  try {
    await main(user, accountData)
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error creating account"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}