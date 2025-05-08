"use server";
import argon2 from "argon2";
import { env } from "@/env";
import { redirect } from "next/navigation";
import { createSession, getSession } from "@/lib/jwt-strategy";
import { z } from "zod";
import { formDataToObject } from "./utils";
import { getUserByEmail } from "@/db/use-cases/get-user";
import { addUser } from "@/db/use-cases/add-user";

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

type TResponse = {
  success: boolean;
};

interface LoginResponse extends TResponse {
  errors?: {
    email?: string[] | undefined;
    password?: string[] | undefined;
  };
}

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export async function loginAction(
  previous: LoginResponse,
  unverified: FormData,
): Promise<LoginResponse> {
  const session = await getSession();
  if (session) {
    return { success: false };
  }

  const object = formDataToObject(unverified);
  const { success, data, error } = loginSchema.safeParse(object);

  if (!success) {
    return { success: false, errors: error.flatten().fieldErrors };
  }

  const user = await getUserByEmail(data.email);
  if (!user)
    return {
      success: false,
      errors: {
        email: ["Incorrect email or password"],
        password: ["Incorrect email or password"],
      },
    };

  const isUser = await isSamePassword(data.password, user.password);
  if (!isUser)
    return {
      success: false,
      errors: {
        email: ["Incorrect email or password"],
        password: ["Incorrect email or password"],
      },
    };
  await createSession({ id: user.id, name: user.name, email: user.email });
  return { success: true };
}

interface RegisterResponse extends TResponse {
  errors?: {
    name?: string[] | undefined;
    email?: string[] | undefined;
    password?: string[] | undefined;
  };
  message?: string;
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot be longer than 50 characters."),
});

export async function registerAction(
  previous: RegisterResponse,
  unverified: FormData,
): Promise<RegisterResponse> {
  const session = await getSession();
  if (session) return { success: false };

  const object = formDataToObject(unverified);
  const { success, data, error } = registerSchema.safeParse(object);

  if (!success) return { success: false, errors: error.flatten().fieldErrors };

  const user = await getUserByEmail(data.email);
  if (user) {
    return {
      success: false,
      errors: {
        email: ["Email is already associated with an account."],
      },
    };
  }
  const hash = await hashPassword(data.password);
  const userId = await addUser({
    name: data.name,
    email: data.email,
    password: hash,
    createdAt: new Date(Date.now()),
  });

  if (!userId)
    return { success: false, message: "Failed to register. Try again later." };

  await createSession({ id: userId, name: data.name, email: data.email });

  return { success: true };
}
