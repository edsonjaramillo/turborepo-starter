import type { Database } from "../client";
import { type PermissionName, permissionsTable } from "../schema/permissions";

export function createPermissionsRepository(db: Database) {
	return {
		async create(name: PermissionName) {
			await db.insert(permissionsTable).values({ name });
		},
	};
}
