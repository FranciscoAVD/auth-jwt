import { getUserByEmail } from "@/db/use-cases/get-user";
import { env } from "@/env";
import { decrypt, encrypt } from "@/lib/jwt-strategy";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import argon from "argon2";
import { getOneWeekFromNow } from "@/lib/utils";
import { addUser } from "@/db/use-cases/add-user";

const registerSchema = z.object({
  name: z.string().min(1),
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
  const { success, data, error } = registerSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        errors: error.flatten().fieldErrors,
        message: "Failed validation.",
      },
      {
        status: 422,
      },
    );
  }

  const user = await getUserByEmail(data.email);

  if (user) {
    return NextResponse.json(
      {
        success: false,
        errors: {
          email: ["Email is already associated with an account."],
        },
        message: undefined,
      },
      {
        status: 409,
      },
    );
  }

  
  const hash = await argon.hash(data.password + env.PEPPER, {
    type: argon.argon2id,
  });

  const userId = await addUser({
    name: data.name,
    email: data.email,
    password: hash,
    createdAt: new Date(Date.now()),
  });

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        errors: undefined,
        message: "Failed to register. Try again later.",
      },
      {
        status: 500,
      },
    );
  }

  const response = NextResponse.json(
    { success: true, errors: undefined, message: "Registered." },
    { status: 200 },
  );

  const expiresAt = getOneWeekFromNow();
  const sessionData = { id: userId, name: data.name, email: data.email };
  const jwt = await encrypt({ sessionData, expiresAt });

  response.cookies.set(env.SESSION_NAME, jwt, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
  });

  return response;
}
