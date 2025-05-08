import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  server:{
    DATABASE_URL: z.string().min(1, "Database connection url is required."),
    PEPPER: z.string().min(1, "Pepper is required. See README.md"),
    NODE_ENV: z.enum(["development", "production"], {
      message: "Invalid Node environment."
    }),
    SESSION_NAME: z.string().min(1, "Session name is required."),
    SESSION_SECRET: z.string().min(1, "Secret is required. See README.md")
  },
  runtimeEnv:{
    DATABASE_URL: process.env.DATABASE_URL,
    PEPPER: process.env.PEPPER,
    NODE_ENV: process.env.NODE_ENV,
    SESSION_NAME: process.env.SESSION_NAME,
    SESSION_SECRET: process.env.SESSION_SECRET
  }
})
