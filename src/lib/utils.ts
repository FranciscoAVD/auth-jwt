import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import argon2 from "argon2";
import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formDataToObject(data: FormData): Record<string, string> {
  const formObject: Record<string, string> = {};
  data.forEach((value, key) => {
    formObject[key] = value.toString();
  });
  return formObject;
}

export function getOneWeekFromNow():Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}


