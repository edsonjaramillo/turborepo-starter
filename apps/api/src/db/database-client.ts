import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { apiEnv } from "../api-env";
import { relations } from "./schema/relations";

const pool = new Pool({
	host: apiEnv.DATABASE_HOST,
	password: apiEnv.DATABASE_PASSWORD,
	port: apiEnv.DATABASE_PORT,
	user: apiEnv.DATABASE_USER,
	database: apiEnv.DATABASE_NAME,
});

export const db = drizzle({
	client: pool,
	relations,
	casing: "snake_case",
});
