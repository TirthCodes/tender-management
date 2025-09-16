import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToDecimal(value: string) {
  if(typeof value !== "string") return value;
  return parseFloat(value).toFixed(2);
}