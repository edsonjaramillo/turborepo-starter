import { createDb } from "@repo/db/client";

import { apiEnv } from "./api-env";

export const database = createDb({
	host: apiEnv.DATABASE_HOST,
	password: apiEnv.DATABASE_PASSWORD,
	port: apiEnv.DATABASE_PORT,
	user: apiEnv.DATABASE_USER,
	database: apiEnv.DATABASE_NAME,
});
