
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
