import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOneWeekFromNow():Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}


