import { NextRequest } from "next/server";
import { getUserByEmail } from "@/db/use-cases/get-user";
import { env } from "@/env";
import { apiResponse } from "@/features/auth/lib/utils";
import { decrypt, encrypt } from "@/lib/jwt-strategy";
import { loginSchema } from "@/features/auth/lib/schemas";
import { isSamePassword } from "@/features/auth/lib/hash";
import { getOneWeekFromNow } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await decrypt(req.cookies.get(env.SESSION_NAME)?.value);
  if (session !== null)
    return apiResponse("Forbidden", "Already authenticated.");

  const body = await req.json();
  const { success, data, error } = loginSchema.safeParse(body);
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

  if (user === null)
    return apiResponse("Unauthorized", "Unable to login.", {
      email: ["Email or password incorrect."],
      password: ["Email or password incorrect."],
    });

  const isUser = await isSamePassword(data.password, user.password);

  if (!isUser)
    return apiResponse("Unauthorized", "Unable to login.", {
      email: ["Email or password incorrect."],
      password: ["Email or password incorrect."],
    });

  const response = apiResponse("Success", "Login successful.");
  const sessionData = { id: user.id, name: user.name, email: user.email };
  const expiresAt = getOneWeekFromNow();
  const jwt = await encrypt({sessionData, expiresAt});

  response.cookies.set(env.SESSION_NAME, jwt, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
  });

  return response;
}
