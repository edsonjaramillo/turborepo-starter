import { drizzle } from "drizzle-orm/node-postgres";
import type { PoolConfig } from "pg";
import { Pool } from "pg";

import { createPermissionsRepository } from "./repositories/permissions";
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
	const client = new Pool({
		host: config.host,
		password: config.password,
		port: config.port,
		user: config.user,
		database: config.database,
		ssl: config.ssl,
	});

	return drizzle({ client, relations });
}

export type Database = ReturnType<typeof createDatabaseClient>;

export function createDb(config: DatabaseConfig) {
	const db = createDatabaseClient(config);

	return {
		db,
		permissions: createPermissionsRepository(db),
		sessions: createSessionsRepository(db),
		users: createUsersRepository(db),
	};
}

export type DatabaseInstance = ReturnType<typeof createDb>;
