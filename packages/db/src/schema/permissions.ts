import { pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "./shared";

export const permissionNames = ["users:read", "all"] as const;

export type PermissionName = (typeof permissionNames)[number];

export const permissionsTable = pgTable("permissions", {
	id,
	createdAt,
	updatedAt,
	name: text().$type<PermissionName>().notNull().unique(),
});
