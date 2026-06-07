import { eq } from "drizzle-orm";

import type { Database } from "../client";
import { sessionsTable } from "../schema/sessions";

export function createSessionsRepository(db: Database) {
	return {
		async getById(sessionId: string) {
			return await db.query.sessionsTable.findFirst({
				where: { id: sessionId },
				columns: { id: true, expiresAt: true },
			});
		},

		async getSignInProfileById(sessionId: string) {
			return await db.query.sessionsTable.findFirst({
				where: { id: sessionId },
				columns: { id: true, expiresAt: true },
				with: {
					user: {
						columns: { firstName: true, lastName: true, email: true },
					},
				},
			});
		},

		async create(userId: string, expiresAt: Date) {
			const [session] = await db.insert(sessionsTable).values({ userId, expiresAt }).returning();
			if (!session) {
				return undefined;
			}
			return session;
		},

		async deleteById(sessionId: string) {
			await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
		},
	};
}
