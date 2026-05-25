import { drizzle } from "drizzle-orm/node-postgres";
import type { PoolConfig } from "pg";
import { Pool } from "pg";

import { createSessionsRepository } from "./repositories/sessions";
import { createUsersRepository } from "./repositories/users";
import { relations } from "./schema/relations";

export interface DatabaseConfig {
	host: string;
	password: string;
	port: number;
	user: string;
	database: string;
	ssl?: PoolConfig["ssl"];
}

function createDatabaseClient(config: DatabaseConfig) {
	const pool = new Pool({
		host: config.host,
		password: config.password,
		port: config.port,
		user: config.user,
		database: config.database,
		ssl: config.ssl,
	});

	return drizzle({
		client: pool,
		relations,
		casing: "snake_case",
	});
}

export type Database = ReturnType<typeof createDatabaseClient>;

export function createDb(config: DatabaseConfig) {
	const db = createDatabaseClient(config);

	return {
		db,
		users: createUsersRepository(db),
		sessions: createSessionsRepository(db),
	};
}

export type DatabaseInstance = ReturnType<typeof createDb>;
