import { pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "./shared";

export const permissionsTable = pgTable("permissions", {
	id,
	createdAt,
	updatedAt,
	name: text().notNull().unique(),
});
