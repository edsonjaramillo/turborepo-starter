import { defineRelations } from "drizzle-orm";

import { sessionsTable } from "./sessions";
import { usersTable } from "./users";

export const relations = defineRelations({ usersTable, sessionsTable }, (r) => ({
	sessionsTable: {
		user: r.one.usersTable({
			from: r.sessionsTable.userId,
			to: r.usersTable.id,
			optional: false,
		}),
	},
	usersTable: {
		userSessions: r.many.sessionsTable({
			from: r.usersTable.id,
			to: r.sessionsTable.userId,
		}),
	},
}));
