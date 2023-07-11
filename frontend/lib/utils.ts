import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validAPIKey(api_key: string) {
  return api_key == "" || (api_key.length == 51 && api_key.substring(0, 3) == "sk-")
}
