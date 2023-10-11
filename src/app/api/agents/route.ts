import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { auth } from "../../../../auth/lucia";
import * as context from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  return await prisma.user.findMany()
}

export const GET = async (request: NextRequest) => {
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