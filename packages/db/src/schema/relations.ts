import { defineRelations } from "drizzle-orm";

import { permissionsTable } from "./permissions";
import { sessionsTable } from "./sessions";
import { usersTable } from "./users";

export const relations = defineRelations({ usersTable, sessionsTable, permissionsTable }, (r) => ({
	sessionsTable: {
		user: r.one.usersTable({
			from: r.sessionsTable.userId,
			to: r.usersTable.id,
		}),
	},
	usersTable: {
		sessions: r.many.sessionsTable({
			from: r.usersTable.id,
			to: r.sessionsTable.userId,
		}),
	},
}));
