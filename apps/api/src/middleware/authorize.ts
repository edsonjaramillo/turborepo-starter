import type { PermissionName } from "@repo/db/schema/permissions";
import type { FastifyRequest } from "fastify";

import { database } from "../api-db";
import { getCookie } from "../utils/cookies";

type PermissionArray = readonly [PermissionName, ...PermissionName[]];

export async function authorized(request: FastifyRequest, allowedPermissions: PermissionArray) {
	const sessionId = getCookie(request, "session");
	if (sessionId === null) {
		return { unauthorized: true, forbidden: false };
	}

	const session = await database.sessions.getById(sessionId);

	if (!session) {
		return { unauthorized: true, forbidden: false };
	}

	const user = await database.users.getUserPermissions(session.userId);
	if (!user) {
		return { unauthorized: true, forbidden: false };
	}

	for (const permission of user.permissions) {
		if (allowedPermissions.includes(permission.name) || permission.name === "all")
			return { unauthorized: false, forbidden: false };
	}

	return { unauthorized: false, forbidden: true };
}
