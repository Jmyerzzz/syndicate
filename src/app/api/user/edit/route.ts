import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(userId: string, userData: any) {
  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name: userData.name,
      username: userData.username,
      risk_percentage: userData.risk,
      gabe_way: parseInt(userData.gabeWay)
    }
  })
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const userId = data.userId;
  const userData = data.userData;
  try {
    await main(userId, userData);
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error updating user"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}