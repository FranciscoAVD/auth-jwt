import "server-only";

import { type SessionData } from "@/lib/jwt-strategy";
import { getCurrentUser } from "@/lib/jwt-strategy";

export async function Authenticated({
  children,
}: {
  children: (user: SessionData) => React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  return <>{children(user)}</>;
}

export async function Unauthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) return null;
  return <>{children}</>;
}
