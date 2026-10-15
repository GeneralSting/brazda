import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside of Vite, so it loads the local variables by itself
if (existsSync(".env.local")) {
	process.loadEnvFile(".env.local");
}

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/db/schema",
	out: "./drizzle", // generated SQL migrations, commited and applied in order
	casing: "snake_case",
	// migrations go over the direct connection, the pooler is for the application
	dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
