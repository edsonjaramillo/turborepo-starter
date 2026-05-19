import { db } from "../database-client";
import { sessionsTable } from "../schema/sessions-schema";

export class SessionQueries {
	static async getSessionById(sessionId: string) {
		await db.query.sessionsTable.findFirst({
			where: { id: sessionId },
			columns: { id: true, expiresAt: true },
		});
	}

	static async createSession(userId: string, expiresAt: Date) {
		return await db.insert(sessionsTable).values({ userId, expiresAt }).returning();
	}
}
