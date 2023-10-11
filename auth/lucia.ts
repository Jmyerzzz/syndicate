import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";
import * as context from "next/headers";

const client = new PrismaClient();

export const auth = lucia({
  env: "DEV", // "PROD" if deployed to HTTPS
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false
  },
  getUserAttributes: (data) => {
    return {
      username: data.username
    };
  },
  adapter: prisma(client, {
    user: "user", // model User {}
    key: "key", // model Key {}
    session: "session" // model Session {}
  })
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});