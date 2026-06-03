import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { lower } from "./functions";
import { createdAt, id, updatedAt } from "./shared";

export const usersTable = pgTable(
	"users",
	{
		id,
		createdAt,
		updatedAt,
		firstName: text().notNull(),
		lastName: text().notNull(),
		email: text().notNull(),
		passwordHash: text().notNull(),
	},
	(table) => [uniqueIndex("emailUniqueIndex").on(lower(table.email))],
);
