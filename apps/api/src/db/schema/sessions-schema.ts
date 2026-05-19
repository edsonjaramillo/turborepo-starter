import { zString } from "@repo/validation/core";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { createdAt, id, updatedAt } from "./shared";
import { usersTable } from "./users-schema";

export const sessionsTable = pgTable(
	"sessions",
	{
		id,
		createdAt,
		updatedAt,
		userId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
		expiresAt: timestamp().notNull(),
	},
	(table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const sessionSignInSchema = z.object({
	id: zString,
	name: zString,
});
