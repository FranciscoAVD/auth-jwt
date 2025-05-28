import { addUser } from "@/db/use-cases/add-user";
import { getUserByEmail } from "@/db/use-cases/get-user";
import { env } from "@/env";
import { hashPassword } from "@/features/auth/lib/hash";
import { registerSchema } from "@/features/auth/lib/schemas";
import { apiResponse } from "@/features/auth/lib/utils";
import { decrypt, encrypt } from "@/lib/jwt-strategy";
import { NextRequest } from "next/server";
import { getOneWeekFromNow } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await decrypt(req.cookies.get(env.SESSION_NAME)?.value);
  if (session !== null)
    return apiResponse("Forbidden", "Already authenticated.");

  const body = await req.json();
  const { success, data, error } = registerSchema.safeParse(body);
  if (!success)
    return apiResponse(
      "Unprocessable content",
      "Failed validation.",
      error.flatten().fieldErrors,
    );

  const user = await getUserByEmail(data.email);

  if (user instanceof Error) {
    console.error(user.message);
    return apiResponse(
      "Internal server error",
      "Something went wrong. Try again later.",
    );
  }

  if (user !== null)
    return apiResponse("Conflict", "Unable to register.", {
      email: ["Email is already in use."],
    });

  const passwordHash = await hashPassword(data.password);
  const userId = await addUser({
    name: data.name,
    email: data.email,
    password: passwordHash,
  });

  if (userId instanceof Error) {
    console.error(userId.message);
    return apiResponse(
      "Internal server error",
      "Something went wrong. Try again later.",
    );
  }

  const response = apiResponse("Resource created", "Registered.");

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
