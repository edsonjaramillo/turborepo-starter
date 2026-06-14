import { eq } from "drizzle-orm";

import type { Database } from "../client";
import { sessionsTable } from "../schema/sessions";

export function createSessionsRepository(db: Database) {
	return {
		getById(sessionId: string) {
			return db.query.sessionsTable.findFirst({
				where: { id: sessionId },
				columns: { id: true, expiresAt: true },
			});
		},

		getSignInProfileById(sessionId: string) {
			return db.query.sessionsTable.findFirst({
				where: { id: sessionId },
				columns: { id: true, expiresAt: true },
				with: { user: { columns: { firstName: true, lastName: true, email: true } } },
			});
		},

		async create(userId: string, expiresAt: Date) {
			const [session] = await db.insert(sessionsTable).values({ userId, expiresAt }).returning();
			return session;
		},

		async updateExpiresAt(sessionId: string, expiresAt: Date) {
			const [session] = await db
				.update(sessionsTable)
				.set({ expiresAt })
				.where(eq(sessionsTable.id, sessionId))
				.returning();
			return session;
		},

		async deleteById(sessionId: string) {
			await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
		},
	};
}
