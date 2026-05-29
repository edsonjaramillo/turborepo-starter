import { defineConfig } from "drizzle-kit";

import { dbEnv } from "./src/env";

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		host: dbEnv.DATABASE_HOST,
		password: dbEnv.DATABASE_PASSWORD,
		port: dbEnv.DATABASE_PORT,
		user: dbEnv.DATABASE_USER,
		database: dbEnv.DATABASE_NAME,
		ssl: false,
	},
	schema: "./src/schema/*.ts",
	out: "./drizzle",
	strict: true,
	verbose: true,
});
