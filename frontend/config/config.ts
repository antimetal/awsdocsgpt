import { Settings, Limits } from "@/types/settings"

export const SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT
export const CHAT_ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT
export const CHAT_MODEL = process.env.CHAT_MODEL || 'gpt-3.5-turbo'
export const IS_PRODUCTION = process.env.NODE_ENV === "production"

export const DEFAULT_SETTINGS: Settings = {
  mode: "2",
  results: "5",
  sentences: "short",
  threshold: "0.5",
  api_key: ""
}

export const DEFAULT_LIMITS: Limits = {
  results_max: 10,
  results_min: 1,
}