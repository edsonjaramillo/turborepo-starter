import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "./shared";
import { usersTable } from "./users";

export const sessionsTable = pgTable(
	"sessions",
	{
		id,
		createdAt,
		updatedAt,
		userId: uuid()
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
		expiresAt: timestamp({ withTimezone: true }).notNull(),
	},
	(table) => [index("sessions_user_id_idx").on(table.userId)],
);
