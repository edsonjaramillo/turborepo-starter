import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { permissionsTable } from "./permissions";
import { usersTable } from "./users";

export const usersPermissionsTable = pgTable(
	"users_permissions",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
		permissionId: uuid("permission_id")
			.notNull()
			.references(() => permissionsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.permissionId] }),
		index("users_permissions_permission_id_idx").on(table.permissionId),
	],
);
