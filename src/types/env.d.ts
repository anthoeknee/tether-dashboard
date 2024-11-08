declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      NEXT_PUBLIC_DISCORD_BOT_INVITE_URL: string;
      DISCORD_BOT_TOKEN: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      DATABASE_URL: string;
    }
  }
}

export {}; 