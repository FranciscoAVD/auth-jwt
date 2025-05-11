import { cookies } from "next/headers";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cache } from "react";
import { env } from "@/env";
import { getOneWeekFromNow } from "@/lib/utils";
import { z } from "zod";

const sessionDataSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

type SessionData = z.infer<typeof sessionDataSchema>;

interface Payload extends JWTPayload {
  data: SessionData;
  expiresAt: Date;
}

const encodedKey = new TextEncoder().encode(env.SESSION_SECRET);
const alg = "HS256" as const;

async function encrypt(payload: Payload): Promise<string> {
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

export async function createSession(data: SessionData): Promise<void> {
  const expiresAt = getOneWeekFromNow();
  const jwt = await encrypt({ data, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_NAME, jwt, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
  });
}

export async function getSession(): Promise<Payload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(env.SESSION_NAME)?.value;
  return await decrypt(cookie);
}

export const getCurrentUser = cache(async (): Promise<SessionData | null> => {
  const session = await getSession();
  const { success, data } = sessionDataSchema.safeParse(session?.data);
  return success ? data : null;
});

export async function deleteSession():Promise<void>{
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_NAME);
}
