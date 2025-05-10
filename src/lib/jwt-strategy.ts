import { cookies } from "next/headers";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cache } from "react";
import { env } from "@/env";
import { User } from "@/db/types";
import { getOneWeekFromNow } from "@/lib/utils";
import { z } from "zod";

type SessionData = {
  id: User["id"];
  email: User["email"];
  name: User["name"];
};

interface Payload extends JWTPayload {
  sessionData: SessionData;
  expiresAt: Date;
}

const encodedKey = new TextEncoder().encode(env.SESSION_SECRET);
const alg = "HS256" as const;

export async function encrypt(payload: Payload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: alg })
    .setIssuedAt()
    .setExpirationTime(getOneWeekFromNow())
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<Payload | null> {
  try {
    if (!session) return null;
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: [alg],
    });
    return payload as Payload;
  } catch (err) {
    console.log("Failed to decrypt token.");
    return null;
  }
}

export async function getSession(): Promise<Payload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(env.SESSION_NAME)?.value;
  return await decrypt(cookie);
}

const sessionDataSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});
export const getCurrentUser = cache(async (): Promise<SessionData | null> => {
  const session = await getSession();
  const { success, data } = sessionDataSchema.safeParse(session?.sessionData);
  return success ? data : null;
});

export async function deleteSession():Promise<void>{
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_NAME);
}
