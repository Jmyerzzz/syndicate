import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { auth } from "../../../../auth/lucia";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const formData = await request.json();
  const name = formData.name;
  const risk = parseInt(formData.risk);
  const gabeWay = parseInt(formData.gabeWay);
  const username = formData.username;
  const password = formData.password;
  // basic check
  if (
    typeof name !== "string" ||
    !name
  ) {
    return NextResponse.json(
      {
        error: "Name required"
      },
      {
        status: 400
      }
    );
  }
  if (
    typeof risk !== "number" ||
    !risk
  ) {
    return NextResponse.json(
      {
        error: "Risk required"
      },
      {
        status: 400
      }
    );
  }
  if (
    typeof gabeWay !== "number" ||
    !gabeWay
  ) {
    return NextResponse.json(
      {
        error: "Gabe Way required"
      },
      {
        status: 400
      }
    );
  }
  if (
    typeof username !== "string" ||
    username.length < 4 ||
    username.length > 31
  ) {
    return NextResponse.json(
      {
        error: "Invalid username"
      },
      {
        status: 400
      }
    );
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return NextResponse.json(
      {
        error: "Invalid password"
      },
      {
        status: 400
      }
    );
  }
  try {
    await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: username.toLowerCase(), // unique id when using "username" auth method
        password // hashed by Lucia
      },
      attributes: {
        name,
        risk_percentage: risk,
        gabe_way: gabeWay,
        username
      }
    });
    // const session = await auth.createSession({
    //   userId: user.userId,
    //   attributes: {}
    // });
    // const authRequest = auth.handleRequest(request.method, context);
    // authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      // headers: {
      //   Location: BASE_URL + "/" // redirect to profile page
      // }
    });
  } catch (e) {
    // this part depends on the database you're using
    // check for unique constraint error in user table
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "Username already taken"
        },
        {
          status: 400
        }
      );
    }

    return NextResponse.json(
      {
        error: "An unknown error occurred"
      },
      {
        status: 500
      }
    );
  }
};