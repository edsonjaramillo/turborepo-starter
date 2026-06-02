import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { lower } from "./functions";
import { createdAt, id, updatedAt } from "./shared";

export const usersTable = pgTable(
	"users",
	{
		id,
		createdAt,
		updatedAt,
		firstName: text("first_name").notNull(),
		lastName: text("last_name").notNull(),
		email: text().notNull(),
		password: text().notNull(),
	},
	(table) => [uniqueIndex("emailUniqueIndex").on(lower(table.email))],
);

export const userColumns = {
	id: true,
	firstName: true,
	lastName: true,
	email: true,
} as const;
