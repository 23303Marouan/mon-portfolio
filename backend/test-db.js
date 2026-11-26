
import dotenv from "dotenv";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle({ client: pool });

try {
  const result = await db.execute("SELECT 1");
  console.log("Drizzle fonctionne :", result);
} catch (error) {
  console.error("Erreur Drizzle :", error);
} finally {
  await pool.end();
}
