export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com",
  API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 15000),
  APP_ENV: (process.env.EXPO_PUBLIC_APP_ENV ?? "development") as
    | "development"
    | "staging"
    | "production",
  STUB_STRATEGY: process.env.EXPO_PUBLIC_STUB_STRATEGY === "true",
} as const;

export const isDev = env.APP_ENV === "development";
export const isStaging = env.APP_ENV === "staging";
export const isProd = env.APP_ENV === "production";
