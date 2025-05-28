import "server-only";
import argon2 from "argon2";
import { env } from "@/env";

export async function hashPassword(digest: string): Promise<string> {
  return await argon2.hash(digest + env.PEPPER, {
    type: argon2.argon2id,
  });
}

export async function isSamePassword(
  unverified: string,
  hash: string,
): Promise<boolean> {
  return await argon2.verify(hash, unverified + env.PEPPER);
}
