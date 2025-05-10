import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/jwt-strategy";
import { env } from "@/env";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await decrypt(req.cookies.get(env.SESSION_NAME)?.value);

  if (!session && path.startsWith("/protected"))
    return NextResponse.redirect(new URL("/login", req.nextUrl));

  //If there is a session, direct to dashboard overview.
  if (session && (path.startsWith("/login") || path.startsWith("/register")))
    return NextResponse.redirect(new URL("/protected", req.nextUrl));

  return NextResponse.next();
}
