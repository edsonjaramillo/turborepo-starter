import { defineRelations } from "drizzle-orm";

import { permissionsTable } from "./permissions";
import { sessionsTable } from "./sessions";
import { usersTable } from "./users";
import { usersPermissionsTable } from "./users-permissions";

export const relations = defineRelations(
	{ usersTable, sessionsTable, permissionsTable, usersPermissionsTable },
	(r) => ({
		permissionsTable: {
			users: r.many.usersTable({
				from: r.permissionsTable.id.through(r.usersPermissionsTable.permissionId),
				to: r.usersTable.id.through(r.usersPermissionsTable.userId),
			}),
		},
		sessionsTable: {
			user: r.one.usersTable({
				from: r.sessionsTable.userId,
				to: r.usersTable.id,
			}),
		},
		usersTable: {
			permissions: r.many.permissionsTable({
				from: r.usersTable.id.through(r.usersPermissionsTable.userId),
				to: r.permissionsTable.id.through(r.usersPermissionsTable.permissionId),
			}),
			sessions: r.many.sessionsTable({
				from: r.usersTable.id,
				to: r.sessionsTable.userId,
			}),
		},
	}),
);
