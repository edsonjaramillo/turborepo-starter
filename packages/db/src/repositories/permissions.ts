import type { Database } from "../client";
import { permissionsTable } from "../schema/permissions";

export function createPermissionsRepository(db: Database) {
	return {
		async create(name: string) {
			await db.insert(permissionsTable).values({ name });
		},
	};
}
