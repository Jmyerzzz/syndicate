import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  return await prisma.user.findMany({
    where: {
      role: "AGENT"
    }
  })
}

export const GET = async () => {
  try {
    const users = await main()
    return new Response(JSON.stringify(users), {
      status: 200,
    });
  } catch (e) {
    console.error(e)
      return NextResponse.json(
        {
          error: "Error fetching users"
        },
        {
          status: 400
        }
      );
  } finally {
    await prisma.$disconnect()
  }
}