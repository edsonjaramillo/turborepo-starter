import { pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "./shared";

export const usersTable = pgTable("users", {
	id,
	createdAt,
	updatedAt,
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
});

export const userColumns = {
	id: true,
	firstName: true,
	lastName: true,
	email: true,
} as const;
