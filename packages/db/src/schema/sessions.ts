import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { createdAt, id, onCascade, updatedAt } from "./shared";
import { usersTable } from "./users";

export const sessionsTable = pgTable("sessions", {
	id,
	createdAt,
	updatedAt,
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, onCascade),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
