import Config from 'react-native-config';

export const env = {
  API_URL: Config.API_URL ?? 'https://api.example.com',
  API_TIMEOUT: Number(Config.API_TIMEOUT ?? 15000),
  APP_ENV: (Config.APP_ENV ?? 'development') as 'development' | 'staging' | 'production',
} as const;

export const isDev = env.APP_ENV === 'development';
export const isStaging = env.APP_ENV === 'staging';
export const isProd = env.APP_ENV === 'production';
