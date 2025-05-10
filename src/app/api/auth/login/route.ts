import { getUserByEmail } from "@/db/use-cases/get-user";
import { env } from "@/env";
import { decrypt, encrypt } from "@/lib/jwt-strategy";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import argon from "argon2";
import { getOneWeekFromNow } from "@/lib/utils";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {

  const session = await decrypt(request.cookies.get(env.SESSION_NAME)?.value);
  if (session) {
    return NextResponse.json(
      {
        success: false,
        errors: undefined,
        message: "Already authenticated.",
      },
      {
        status: 403,
      },
    );
  }

  const body = await request.json();
  const { success, data, error } = loginSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        errors: error.flatten().fieldErrors,
        message: "Validation failed.",
      },
      {
        status: 422,
      },
    );
  }

  const user = await getUserByEmail(data.email);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        errors: {
          email: ["Email or password incorrect."],
          password: ["Email or password incorrect."],
        },
        message: undefined,
      },
      {
        status: 404,
      },
    );
  }

  const isUser = await argon.verify(user.password, data.password + env.PEPPER);

  if (!isUser) {
    return NextResponse.json(
      {
        success: false,
        errors: {
          email: ["Email or password incorrect."],
          password: ["Email or password incorrect."],
        },
        message: undefined,
      },
      {
        status: 404,
      },
    );
  }

  //Create response
  const response = NextResponse.json(
    { success: true, errors: undefined, message: "Authenticated." },
    { status: 200 },
  );
  const expiresAt = getOneWeekFromNow();
  const sessionData = { id: user.id, name: user.name, email: data.email };
  const jwt = await encrypt({ sessionData, expiresAt });

  response.cookies.set(env.SESSION_NAME, jwt, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
  });

  return response;
}
