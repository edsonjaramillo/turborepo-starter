import process from "node:process";

import { defineConfig } from "drizzle-kit";

const env = process.env;
export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		host: env.DATABASE_HOST as string,
		password: env.DATABASE_PASSWORD as string,
		port: Number(env.DATABASE_PORT),
		user: env.DATABASE_USER as string,
		database: env.DATABASE_NAME as string,
		ssl: false,
	},
	schema: "./src/db/schema/*-schema.ts",
	casing: "snake_case",
	strict: true,
	verbose: true,
});
