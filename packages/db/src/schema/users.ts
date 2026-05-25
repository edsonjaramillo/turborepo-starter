import { pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "./shared";

export const usersTable = pgTable("users", {
	id,
	createdAt,
	updatedAt,
	name: text().notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
});

export const userColumns = {
	id: true,
	name: true,
	email: true,
} as const;
