import type { Database } from "../client";
import { sessionsTable } from "../schema/sessions";

export function createSessionsRepository(db: Database) {
	return {
		async getById(sessionId: string) {
			// URGENT: the old session lookup dropped its query result, so return it from the repository.
			return await db.query.sessionsTable.findFirst({
				where: { id: sessionId },
				columns: { id: true, expiresAt: true },
			});
		},

		async create(userId: string, expiresAt: Date) {
			const [session] = await db.insert(sessionsTable).values({ userId, expiresAt }).returning();
			if (!session) {
				return undefined;
			}
			return session;
		},
	};
}
