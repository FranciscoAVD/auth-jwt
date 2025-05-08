import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/jwt-strategy";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await getSession();

  if (!session && path.startsWith("/protected"))
    return NextResponse.redirect(new URL("/login", req.nextUrl));

  //If there is a session, direct to dashboard overview.
  if (session && (path.startsWith("/login") || path.startsWith("/register")))
    return NextResponse.redirect(new URL("/protected", req.nextUrl));

  return NextResponse.next();
}
